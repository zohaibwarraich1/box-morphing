def call(){
  echo "logging into docker account"
  withCredentials([usernamePassword(credentialsId: "docker-login-zohaibwarraich", usernameVariable: "USER", passwordVariable: "PASS")]){
    sh "docker login -u ${env.USER} -p ${env.PASS}"
    echo "Successfully! logged into ${env.USER}"
  }
}
