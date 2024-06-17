.PHONY: all update up down clean prune

all: up

NAME=dev-stockinfo-front
BRANCH=hotfix

# This updates local repo
update:
	@if [ -d .git ];	then \
		git fetch --all && git reset --hard origin/$(BRANCH); \
	else \
		echo "Git repo does not exist. Clone it first."; \
	fi

up:
	@docker-compose up -d \
	&& sleep 5 \
	&& docker logs -t --tail 5 $(NAME)

down:
	docker-compose down

clean:
	docker rmi $(shell docker images -qf dangling=true)

prune:
	docker builder prune -f
