// def call(){
//   echo "Cloning Project/repositery"
//   sh "git clone https://github.com/zohaibwarraich1/box-morphing.git"
//   echo "Cloned the project successfully"
// }
def call() {
    checkout([
        $class: 'GitSCM',
        branches: [[name: '*/main']],  // Apni branch ka naam confirm karein
        userRemoteConfigs: [[
            url: 'https://github.com/zohaibwarraich1/box-morphing.git', 
            credentialsId: 'your-jenkins-credentials-id'
        ]]
    ])
}
