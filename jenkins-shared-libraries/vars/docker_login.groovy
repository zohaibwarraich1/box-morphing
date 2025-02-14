def call(){
  echo "logging into docker account"
  withCredentials([usernamePassword(credentialsId: 'docker_login', usernameVariable: 'USER', passwordVariable: 'PASS')]){
    sh "docker login -u ${env.USER} -p ${env.PASS}"
    echo "Successfully! logged into ${env.USER}"
  }
}
