#! /bin/bash
docker run -d -p 8080:8080 --net=host \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://admin:<>@localhost \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       -e HASURA_GRAPHQL_DEV_MODE=true \
       hasura/graphql-engine:v1.3.0
