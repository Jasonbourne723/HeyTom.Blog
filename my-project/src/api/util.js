var utils = {
    ToDateTime: function(datetime){
        return `${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes() > 9 ? datetime.getMinutes() : "0" + datetime.getMinutes()}:${datetime.getSeconds() > 9 ? datetime.getSeconds() : "0" + datetime.getSeconds()}`; 
    }
}

export default utils;