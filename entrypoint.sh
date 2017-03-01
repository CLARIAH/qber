#!/bin/bash
set -e #exit on errors

#print statements as they are executed
[[ -n $DEBUG_ENTRYPOINT ]] && set -x

case ${1} in
  app:start)
  [ -z "${CSDH_API}" ] && echo "No CSDH Api to connect to. First specify via env variable CSDH_API" && exit 1;
    sed -i 's|<!--ENV_PLACEHOLDER-->|<script type="text/javascript">window.CSDH_API = "'${CSDH_API}'"</script>"|' ./src/index.html
    npm run serve
    ;;
  app:help)
    echo "Available options:"
    echo " app:start        - Starts qber (default)"
    echo " [command]        - Execute the specified command, eg. /bin/bash."
    ;;
  *)
    exec "$@"
    ;;
esac

exit 0
