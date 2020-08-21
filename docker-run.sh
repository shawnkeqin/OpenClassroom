docker run -d -p 8080:8080 --net=host \
       -e HASURA_GRAPHQL_DATABASE_URL="postgres://hasurauser:<>@localhost/open_classroom" \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       -e HASURA_GRAPHQL_DEV_MODE=true \
       -e HASURA_GRAPHQL_ADMIN_SECRET="<>" \
       hasura/graphql-engine:v1.3.0

