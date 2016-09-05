var app = angular.module('portal', [] );

app.controller('portalCtrl', ['$scope','$http', '$window', '$location', function( $scope, $http, $window, $location ){


            
$scope.makeLogin = function(){

		var data = $.param({
                username: $scope.username,
                password: $scope.password
            });
        
        var config = {
        	headers : {
        		'Content-Type': 'application/x-www-form-urlencoded'
        	}
       	};

		$http.post( '/api/login', data , config)
		.success( function( data, status, headers, config ){
		 	
		 	console.log( data, status, headers, config );
		 	if( data == 'success'){
		 		//this this if you want to change the URL and add it to the history stack with new branch
		 		$location.path('/admin');
    			$scope.$apply();	
		 	}
		 	
		})
		.error(function (data, status, header, config) {
			
		});
	};
}]);