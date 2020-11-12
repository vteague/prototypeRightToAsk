
Log api [port 8099] 'https'

get :8099/list                  -> returns all running images
get :8099/imageName             -> returns all logs for that image
get :8099/report                -> returns nginx instances
get :8099/report/nginx_api      -> returns static nginx logs at api level
get :8099/report/nginx_service  -> returns static nginx logs at service level
