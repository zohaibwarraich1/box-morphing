def call(){
  withCredentials([usernamePassword(credentialsId: 'docker_login', usernameVariable: 'USER', passwordVariable: 'PASS')]){
    echo "logging into docker account: ${USER}"
    sh "docker login -u ${USER} -p ${PASS}"
    echo "Successfully! logged into ${USER}"
  }
}
