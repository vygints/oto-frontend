node('slave1'){
  stage ('git'){
     checkout scm
  }
  def image = ''
  stage ('dockerize'){
      image = docker.build "otomato/oto-orders:${env.BUILD_NUMBER}"
  }
    
  stage ('push'){
      image.push()
  }
  def APP_URL=''
  stage ('deploy-to-testing'){
        sh "sed -i -- \'s/BUILD_NUMBER/${env.BUILD_NUMBER}/g\' prod-dep.yml"
		    sh "kubectl create namespace prod-testing-${env.BUILD_NUMBER}"
        sh "kubectl apply -f mongodep.yml --validate=false --namespace=prod-testing-${env.BUILD_NUMBER}"
        sh "kubectl apply -f orders-dep.yml --validate=false --namespace=prod-testing-${env.BUILD_NUMBER}"
        //get app url
        APP_URL = "<pending>"
        sleep 120
        while ( APP_URL == "<pending>"){
            APP_URL = sh returnStdout: true, script: "kubectl get svc otoprod --no-headers=true  --namespace=prod-testing-${env.BUILD_NUMBER} |  awk '{print \$3}'"
            APP_URL = APP_URL.trim()
            
        }
       
        echo "url is ${APP_URL}"
     }
    stage ('component-test'){
       withEnv(["APP_URL=${APP_URL}:8080"]) {
	sh "tests/ct/run.sh"
       }
    }
    stage ('clean-up'){
	sh "kubectl delete ns prod-testing-${env.BUILD_NUMBER}"
    }
