def call(){
  withCredentials([usernamePassword(credentialsId: 'docker_login', usernameVariable: 'USER', passwordVariable: 'PASS')]){
    echo "logging into docker account: ${env.USER}"
    sh "docker login -u ${env.USER} -p ${env.PASS}"
    echo "Successfully! logged into ${env.USER}"
  }
}
