data "aws_ssm_parameter" "db_hostname" {
  name = "/${var.stage}/${var.region}/DB_HOSTNAME"
}

data "aws_ssm_parameter" "token_secret" {
  name = "/${var.stage}/${var.region}/TOKEN_SECRET"
}

data "aws_ssm_parameter" "postgres_password" {
  name = "/${var.stage}/${var.region}/POSTGRES_PASSWORD"
}

data "template_file" "task_definition" {
  template = file("templates/task-definition.json")
  vars = {
    container_memory = var.container_memory
    container_cpu    = var.container_cpu
    container_port   = var.container_port
    container_name   = var.container_name
    image_tag        = var.image_tag
    cluster_name     = var.cluster_name
    task_name        = var.task_name
    region           = var.region
    stage            = var.stage
    project_name     = var.project_name
    # secrets injected securely from AWS SSM systems manager param store
    # https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
    db_hostname       = data.aws_ssm_parameter.db_hostname.arn
    token_secret      = data.aws_ssm_parameter.token_secret.arn
    postgres_password = data.aws_ssm_parameter.postgres_password.arn
    postgres_db       = "main"
  }
}

data "aws_ssm_parameter" "prd_db_hostname" {
  name = "/prd/${var.region}/DB_HOSTNAME"
}

data "aws_ssm_parameter" "prd_token_secret" {
  name = "/prd/${var.region}/TOKEN_SECRET"
}

data "aws_ssm_parameter" "prd_postgres_password" {
  name = "/prd/${var.region}/POSTGRES_PASSWORD"
}

data "template_file" "task_definition_prd" {
  template = file("templates/task-definition.json")
  vars = {
    container_memory = var.container_memory
    container_cpu    = var.container_cpu
    container_port   = var.container_port
    container_name   = var.container_name
    image_tag        = var.image_tag
    cluster_name     = var.cluster_name
    task_name        = var.task_name
    region           = var.region
    stage            = "prd"
    project_name     = var.project_name
    # secrets
    db_hostname       = data.aws_ssm_parameter.prd_db_hostname.arn
    token_secret      = data.aws_ssm_parameter.prd_token_secret.arn
    postgres_password = data.aws_ssm_parameter.prd_postgres_password.arn
    postgres_db       = "prd_main"
  }
}
data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "logs" {
  statement {
    actions = [
      "logs:AssumeRole",
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
  }
  statement {
    sid = "SSMRead"
    actions = [
      "ssm:Get*"
    ]
    resources = [
      "arn:aws:ssm:${var.region}:${var.account_id}:parameter/${var.stage}/*",
      "arn:aws:ssm:${var.region}:${var.account_id}:parameter/prd/*"
    ]
  }
}

resource "aws_iam_policy" "logs" {
  name_prefix = substr(var.task_name, 0, 6)
  description = "ecs logs permission"
  policy      = data.aws_iam_policy_document.logs.json
}

resource "aws_iam_role_policy_attachment" "task_exec_role_policy" {
  role       = aws_iam_role.task_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.task_exec_role.name
  policy_arn = aws_iam_policy.logs.arn
}

resource "aws_iam_role" "task_exec_role" {
  name_prefix        = substr("task-${var.task_name}", 0, 6)
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

# main
resource "aws_ecs_cluster" "cluster" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "task" {
  family = var.task_name

  container_definitions    = data.template_file.task_definition.rendered
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = var.container_memory
  cpu                      = var.container_cpu
  execution_role_arn       = aws_iam_role.task_exec_role.arn
  tags                     = merge({ Name = "dev-task" }, var.tags)
}

resource "aws_ecs_task_definition" "task_prd" {
  family = "prd-${var.task_name}"

  container_definitions    = data.template_file.task_definition_prd.rendered
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = var.container_memory
  cpu                      = var.container_cpu
  execution_role_arn       = aws_iam_role.task_exec_role.arn
  tags                     = merge({ Name = "prd-task" }, var.tags)
}


resource "aws_security_group" "svc_sg" {
  name_prefix = "bn-loadbalancer"
  description = "inbound from load balancer to ecs service"

  vpc_id = var.vpc_id

  ingress {
    description     = "inbound from load balancer"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    self            = true
  }
  ingress {
    description     = "inbound ssh from bastion"
    from_port       = 20
    to_port         = 22
    protocol        = "tcp"
    security_groups = [var.bastion_security_group_id]
    self            = true
  }
  egress {
    description = "outbound traffic to the world"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = merge({ Name = "ecs-service-sg" }, var.tags)
}

resource "aws_ecs_service" "svc" {
  name            = "${var.task_name}-dev"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  launch_type     = "FARGATE"
  desired_count   = var.desired_count

  load_balancer {
    container_name   = var.container_name
    container_port   = var.container_port
    target_group_arn = aws_lb_target_group.default.arn
  }

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [aws_security_group.svc_sg.id, var.db_security_group_id, var.bastion_security_group_id]
    assign_public_ip = true
  }
  depends_on = [aws_lb.alb, aws_lb_listener.https]
  lifecycle {
    ignore_changes = [desired_count]
  }
  tags = merge({ Stage = "dev" }, var.tags)
}

resource "aws_ecs_service" "svc_prd" {
  name            = "${var.task_name}-prd"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task_prd.arn
  launch_type     = "FARGATE"
  desired_count   = var.desired_count

  load_balancer {
    container_name   = var.container_name
    container_port   = var.container_port
    target_group_arn = aws_lb_target_group.prd_target_group.arn
  }

  network_configuration {
    subnets          = var.public_subnet_ids
    security_groups  = [aws_security_group.svc_sg.id, var.db_security_group_id, var.bastion_security_group_id]
    assign_public_ip = true
  }
  depends_on = [aws_lb.alb, aws_lb_listener.https, ]
  lifecycle {
    ignore_changes = [desired_count]
  }
  tags = merge({ Stage = "prd" }, var.tags)
}
