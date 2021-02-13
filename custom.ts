
//% weight=100 color=#0fbc11 icon="\uf1eb"
//% groups="['LAN', 'SERVER']"
namespace IP_NETWORK {
    let receivedtoip : number
    let receivedfromip : string
    let setgflags = 0
   
   
    let myipaddress : number
    let makestring = "" 
    let receivedtext : string 


    let onxHandler:  (name :string,value:number) => void
    let onGroupHandler: (name:string) => void
    //%block="グループ番号$nでデバイスのIPアドレスを192.168.0.$xにする"
    //%weight=100
    //% group="LAN"
    //% n.min=1 n.max=99 n.defl=1
    //% x.min=1 x.max=99 x.defl=1
    
     /**
     * TODO:デバイスのIPアドレスを定めて初期化
     */
    export function oninit(n:number,x:number){
        radio.setGroup(n)
        myipaddress = x
        let flags = 0
        radio.onReceivedNumber(function (receivedNumber: number) {
         
          
            if( receivedNumber == x){
                flags = 1

            }
            
        })

        radio.onReceivedString(function (receivedString: string) {
            
            if (flags == 1){
                receivedtext = receivedString.substr(1,17)
                
            onxHandler(receivedtext,1)
            flags= 0

                

            }
            
        })
    }

         
    /**
     * TODO:デバイス宛のメッセージが来たら実行
   　
     */
    //%weight=90
    //% group="LAN"
    //% block="デバイス宛のアドレスにメッセージを受け取ったら実行する"
    export function onfoo(handler:()=> void){
        onxHandler = handler
      
    }
    /**
     * TODO:受信した文字列（英数字のみ）
   　
     */
    //%weight=80
    //% group="LAN"
    //% block="受信した文字列（英数字）"
    export function receivedstring():string　{ 
        let receivedstring:string
        receivedstring = receivedtext
        return receivedstring




    }
    /**
     * TODO:IPアドレスXに文字列（英数字のみ）を送信
   　
     */
    //%weight=70
    //% group="LAN"
    
    //% block="IPアドレス192.168.0.$nに文字列%yを送信（英数字のみ１７文字まで）"
    //% n.min=1 n.max=99 n.defl=1
    //% y.defl= "HELLO"
    export function sendmessege(n:number,y:string ){
        radio.sendNumber(n)

        makestring =""+ convertToText(myipaddress)+""+y ;
        
        radio.sendString(makestring)
        
        

    }

 /**
     * IPアドレスXに8文字までの暗号化した文字を送信する　（無効化中）
   　
     */

　　　　function sendmessege_mask(n:number,y:string ){
        radio.sendNumber(n)
        let ystr = ""
        for (let i = 0 ; i<y.length-1 ; i++){
            ystr += y.charCodeAt(i)
            
            



        }

        makestring =""+ convertToText(myipaddress)+""+ystr ;
        
        radio.sendString(makestring)
        
        

    }

    /**
     * デバイスのIPアドレス宛に受け取った暗号化されたメッセージを解読する（無効化中）
   　
     */

　function decodemask():string{
    let maskreceivedstring = receivedtext
    let decoded = ""
    
    for (let i = 0;i< 8 ; i++){
        let decodestring = ""
        decodestring =maskreceivedstring.substr(i*2,2)
        
        let x = parseInt(decodestring)
       
        decoded +=  String.fromCharCode(x)
        
        serial.writeLine(decoded)
       



        
     
    }

    let x ="" + decoded


   
    serial.writeLine(x)
    return decoded
    
 

}







     /**
     * TODO:グループXのサーバーになりサーバーにメッセージの流れを監視する
   　
     */
    //%weight=60
    //% group="SERVER"
    //% block="グループ番号$nのサーバーになり、メッセージの流れを見る"
    //% n.min=1 n.max=99 n.defl=1
    export function server(n:number){
        radio.setGroup(n)
        setgflags = 0
         radio.onReceivedNumber(function (receivedNumber: number) {
             
             
         
            if(setgflags == 0){
                setgflags = 1
                receivedtoip = receivedNumber


            }
           
            
        })

        radio.onReceivedString(function (receivedString: string) {
            if(setgflags ==1){
                let ip = receivedString.substr(0,1)
                receivedfromip = ip
                receivedtext = receivedString.substr(1,17)
               
              
                setgflags = 0

                onGroupHandler(receivedtext)


            }

            
            
        })
      
        
    }
    
     /**
     * TODO:メッセージのやり取りがあったら実行する
   　
     */
    //%weight=50
    //% group="SERVER"
    //% block="メッセージのやり取りがあったら"
    
    export function onserver(handler:()=>void){
         onGroupHandler = handler;
        
        
        
    }
    /**
     * TODO:メッセージの内容(形式IPアドレス＋メッセージ)
   　
     */
    //%weight=40
    //% group="SERVER"
    //% block="送出元IPアドレス to 宛先IPアドレス+メッセージの内容の文字列"
    export function  receivedmessage():string　{ 
        let receivedmessage:string;
        receivedmessage = "192.168.0."+""+receivedfromip+"to"+"192.168.0."+""+convertToText(receivedtoip)+""+receivedtext;
        return receivedmessage;
        




    }
        /**
     * TODO:メッセージの内容(形式IPアドレス:メッセージ)
   　
     */
    //%weight=40
    //% group="SERVER"
    //% block="IPアドレス+メッセージの内容の文字列をシリアル通信で出力"
    export function  messagetoserial():void　{ 
       let receivedmessage:string;
       receivedmessage = "|===192.168.0."+""+receivedfromip+"===|===192.168.0."+""+convertToText(receivedtoip)+"==|"+"==="+""+receivedtext+"===|";
       
        serial.writeLine("RECEIVED!"); 
          serial.writeLine("|.....[FROM]......|......[TO]......|......[MESSAGE].....|");
        serial.writeLine(receivedmessage);
        serial.writeLine("|=================|================|====================|");
        
        




    }
    
}
    
    