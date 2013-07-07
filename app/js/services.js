'use strict';
/*global angular google */
/* Services */



// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('geomapApp.services', []).
    value('version', '0.1').
    factory('googleData', ['$q', '$rootScope', function($q, $scope) {
        return function(dataSourceUrl, select) {
            var opts = {sendMethod: 'auto'};
            // dataSourceUrl is something like:
            // https://docs.google.com/spreadsheet/tq?key=<key>&gid=0
            // where <key> is the key from a Google spreadsheet.
            var query = new google.visualization.Query(dataSourceUrl, opts);
  
            // select is a SQLish query such as 'select C, sum(B) group by C'
            if(select) {
                query.setQuery(select);
            }
            // Use angular's defer mechanism to handle the asynchronous response in a manner
            // consistent with the rest of the app.
            var deferred = $q.defer();
            // Send the query with a callback function that in turn uses $scope.$apply to force the callback
            // into a suitable context for angularjs (otherwise the promise won't complete correctly)
            query.send(function (response) {
                $scope.$apply(function() {
                    if (response.isError()) {
                        deferred.reject('Error in query: ' + response.getMessage() + '<br>' + response.getDetailedMessage());
                    }
                    deferred.resolve(response.getDataTable());
                });
            });
            return deferred.promise;
        };
    }]).
    factory('regionFromCountry', function() {
        return function(country) {
            var c_to_r = {
                'BD': '034', 'BE': '155', 'BF': '011', 'BG': '151', 'BA': '039', 'BB': '029', 'WF': '061', 'BL': '029', 'BM': '021', 'BN': '035', 'BO': '005', 
                'JP': '030', 'BI': '014', 'BJ': '011', 'BT': '034', 'BU': '035', 'BW': '018', 'WS': '061', 'BR': '005', 'BS': '029', 'JE': '154', 'BY': '151', 
                'BZ': '013', 'RU': '151', 'RW': '014', 'RS': '039', 'TL': '035', 'RE': '014', 'TM': '143', 'TJ': '143', 'RO': '151', 'TK': '061', 'GW': '011', 
                'GU': '057', 'GT': '013', 'GR': '039', 'GQ': '017', 'GP': '029', 'BH': '145', 'GY': '005', 'GG': '154', 'GF': '005', 'GE': '145', 'GD': '029', 
                'GB': '154', 'GA': '017', 'SV': '013', 'GN': '011', 'GM': '011', 'GL': '021', 'KW': '145', 'GI': '039', 'GH': '011', 'OM': '145', 'TN': '015', 
                'JM': '029', 'IL': '145', 'JO': '145', 'HR': '039', 'HT': '029', 'HU': '151', 'HK': '030', 'HN': '013', 'SU': '151', 'CR': '013', 'VE': '005', 
                'PR': '029', 'PS': '145', 'PW': '057', 'PT': '039', 'KR': '030', 'PY': '005', 'AI': '029', 'KP': '030', 'PF': '061', 'PG': '054', 'PE': '005', 
                'PK': '034', 'PH': '035', 'PN': '061', 'PL': '151', 'PM': '021', 'ZM': '014', 'EH': '015', 'EE': '154', 'EG': '015', 'ZA': '018', 'EC': '005', 
                'IT': '039', 'VN': '035', 'KZ': '143', 'ET': '014', 'ZW': '014', 'KY': '029', 'ES': '039', 'ER': '014', 'ME': '039', 'MD': '151', 'MG': '014', 
                'MF': '029', 'MA': '015', 'MC': '155', 'UZ': '143', 'MM': '035', 'ML': '011', 'MO': '030', 'MN': '030', 'MH': '057', 'MK': '039', 'MU': '014', 
                'MT': '039', 'MW': '014', 'MV': '034', 'MQ': '029', 'MP': '057', 'MS': '029', 'MR': '011', 'AU': '053', 'UG': '014', 'UA': '151', 'MX': '013', 
                'MZ': '014', 'FR': '155', 'FX': '155', 'FI': '154', 'FJ': '054', 'FK': '005', 'FM': '057', 'FO': '154', 'NI': '013', 'NL': '155', 'NO': '154', 
                'NA': '018', 'VU': '054', 'NC': '054', 'NE': '011', 'NF': '053', 'NG': '011', 'NZ': '053', 'ZR': '017', 'NP': '034', 'NR': '057', 'NT': '145', 
                'NU': '061', 'CK': '061', 'CI': '011', 'CH': '155', 'CO': '005', 'CN': '030', 'CM': '017', 'CL': '005', 'CA': '021', 'LB': '145', 'CG': '017', 
                'CF': '017', 'CD': '017', 'CZ': '151', 'CY': '145', 'CS': '039', 'UY': '005', 'CV': '011', 'CU': '029', 'SZ': '018', 'SY': '145', 'KG': '143', 
                'KE': '014', 'SR': '005', 'KI': '057', 'KH': '035', 'KN': '029', 'KM': '014', 'ST': '017', 'SK': '151', 'SJ': '154', 'SI': '039', 'SH': '011', 
                'SO': '014', 'SN': '011', 'SM': '039', 'SL': '011', 'SC': '014', 'SB': '054', 'SA': '145', 'SG': '035', 'SE': '154', 'SD': '015', 'DO': '029', 
                'DM': '029', 'DJ': '014', 'DK': '154', 'VG': '029', 'DD': '155', 'DE': '155', 'YE': '145', 'YD': '145', 'DZ': '015', 'US': '021', 'YU': '039', 
                'YT': '014', 'TZ': '014', 'LC': '029', 'LA': '035', 'TV': '061', 'TW': '030', 'TT': '029', 'TR': '145', 'LK': '034', 'TP': '035', 'LI': '155', 
                'LV': '154', 'TO': '061', 'LT': '154', 'LU': '155', 'LR': '011', 'LS': '018', 'TH': '035', 'TG': '011', 'TD': '017', 'TC': '029', 'LY': '015', 
                'VA': '039', 'VC': '029', 'AE': '145', 'AD': '039', 'AG': '029', 'AF': '034', 'IQ': '145', 'VI': '029', 'IS': '154', 'IR': '034', 'AM': '145', 
                'AL': '039', 'AO': '017', 'AN': '029', 'AS': '061', 'AR': '005', 'IM': '154', 'AT': '155', 'AW': '029', 'IN': '034', 'AX': '154', 'AZ': '145', 
                'IE': '154', 'ID': '035', 'PA': '013', 'MY': '035', 'QA': '145'};
            return c_to_r[country]||country;
        }
    }).factory('regionName', function() {
        return function(code) {
            var code_to_name = {'151': 'Eastern Europe', '155': 'Western Europe', '154': 'Northern Europe', 
            '011': 'Western Africa', '013': 'Central America', '014': 'Eastern Africa', '015': 'Northern Africa', 
            '017': 'Middle Africa', '018': 'Southern Africa', '030': 'Eastern Asia', '057': 'Micronesia', 
            '034': 'Southern Asia', '035': 'South-Eastern Asia', '053': 'Australia and New Zealand', 
            '061': 'Polynesia', '145': 'Western Asia', '143': 'Central Asia', '021': 'Northern America', 
            '005': 'South America', '029': 'Caribbean', '054': 'Melanesia', '039': 'Southern Europe'}
            return code_to_name[code] || 'region '+code;
        }
    });

