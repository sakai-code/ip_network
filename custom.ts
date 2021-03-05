enum lis{
    //%block="0"
    zero = 0,
    //%block="1"
    one = 1,
    //%block="2"
    two = 2,
     //%block="3"
    three = 3,
    //%block="4"
    four = 4,
    //%block="5"
    five = 5,
    //%block="6"
    six = 6,
     //%block="7"
    seven = 7,
    //%block="8"
    eight = 8,
    

    



}

//% weight=100 color=#0fbc11 icon="\uf1eb"
//% groups="['LAN', 'SERVER']"
namespace IP_NETWORK {
    let receivedtoip = 0
    let receivedfromip = ""
    let setgflags = 0
    let receivednumber = 0
    let myipaddress = 0
    let makestring = "" 
    let receivedtext = ""
    
    let targetvalue = 0
    let list = [" ","","","","","","","",""]
    let onxHandler:  (name :string,value:number) => void

   function setinit(handler:()=>void){
        onxHandler = handler
    }
    setinit(function(){})
    

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

                receivedfromip = receivedString.substr(0,1)
                if(receivedtext.substr(0,12) == "REQUESTDATA:"){
                    let  data = parseInt(receivedtext.substr(12,1))
                    let toip = 　parseInt( receivedfromip)
                 radio.sendNumber(toip)
                makestring =""+ convertToText(myipaddress)+""+ list[data];
                radio.sendString(makestring)
                    
                  
                  



                }else{
             
                onxHandler(receivedtext,1)
                flags= 0
                }

                

            }
            
        })

        
    }

         
    /**
     * TODO:デバイス宛のメッセージが来たら実行
   　
     */
    //%weight=90
    //% group="LAN"
    //% receivedtext.defl=receivedtext
    //% draggableParameters="reporter"
    //% block="デバイス宛にメッセージ $receivedtext を受け取ったら実行する"
    export function onreceived(handler:(receivedtext :string)=> void){
        onxHandler = handler
      
    }
    /**
     * TODO:受信したIPアドレス宛にメッセージを返す。
   　
     */
    //%weight=89
    //% group="LAN"
    //% block="受信したIPアドレス宛にメッセージを $t を返す。"

export function　rep(t : string ="OK"):void{
    let toip = 　parseInt( receivedfromip)
    radio.sendNumber(toip)
    makestring =""+ convertToText(myipaddress)+""+t ;
        
   
    

}


     /**
     * TODO:自分のipアドレス（192.168.0.X形式)で表示
   　
     */
    //%weight=90
    //% group="LAN"
    //% block="自分のIpアドレスの192.168.0.〇に設定した数字を表示"
    export function myip():void{
        basic.showNumber(myipaddress)
      
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
     * TODO:サーバーにID　Xのデータを問い合わせる
   　
     */
    //%weight=80
    //% group="LAN"
    //% block="サーバーに　ID $nのデータを問い合わせる　受け取ったデータ: $DATA"
    //% DATA.defl=receivedtext
    //% draggableParameters="reporter"
    export function askdata(n:number,DATA:lis):void　{ 
        radio.sendNumber(0)
        makestring =""+ convertToText(myipaddress)+"REQUESTDATA:"+""+ convertToText(n);
        radio.sendString(makestring)
        
       




    }

     /**
     * TODO:受信した相手のIPアドレス（192.168.0.X形式）
   　
     */
    //%weight=75
    //% group="LAN"
    //% block="受信した相手のIPアドレスの情報（192.168.0.X形式）"
    export function receivedip():string　{ 
        let fromip = ""
        fromip = "192.168.0."+""+receivedfromip
        return fromip




    }

    /**
     * TODO:IPアドレスXに文字列（英数字のみ）を送信
     * @param y 送信する文字列　,eg:"Hello!"
   　
     */
    //%weight=80
    //% group="LAN"
    //% block="IPアドレス192.168.0. $n に文字列 $yを送信（英数字のみ１7文字まで）"
    //% n.min=1 n.max=99 n.defl=1
    export function sendmessege(n:number,y:string ):void{
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
    //% block="グループ番号$n、192.168.0.0のサーバーになり、メッセージの流れを見る"
    //% n.min=1 n.max=99 n.defl=1
    export function server(n:number){
        radio.setGroup(n)
        setgflags = 0
        myipaddress = 0
         radio.onReceivedNumber(function (receivedNumber: number) {
             
             
         
            if(setgflags == 0){
                setgflags = 1
                receivedtoip = receivedNumber
　　　　　　　　　if(receivedtoip == 0){  
                targetvalue = 1  


            }
            


            }
           
            
        })

        radio.onReceivedString(function (receivedString: string) {
            if (setgflags == 1){
                let data = 0
                receivedtext = receivedString.substr(1,17)
                receivedfromip = receivedString.substr(0,1)
                if(targetvalue == 1){
                if(receivedtext.substr(0,12) == "REQUESTDATA:"){
                data = parseInt(receivedtext.substr(12,1))
                
                
                let toip = 　parseInt( receivedfromip)
                radio.sendNumber(toip)
                makestring =""+ convertToText(myipaddress)+""+ list[data];
                radio.sendString(makestring)
                }
                    
                }else{
             
                onxHandler(receivedtext,1)
                setgflags= 0
                }

                

            }

            
            
        })

   
      
        
    }
      /**
     * TODO:　サーバー内にデータをセットし、リクエストがあったら応える　
     */
    //%weight=50
    //% group="SERVER"
    //% block="データをセットしておく"
    export function iot(handler:()=>void){
 
    }
      /**
     * TODO:応答するIDと対応するデータを登録　
     */
    //%weight=50
    //% group="SERVER"
    //% block="ID $nに数字%mをセット（自動的に文字列として保存）"
    export function  setdata(n:lis,m:number){
        list[n] = convertToText(m)


        
 
    }
        /**
     * TODO:応答するIDと対応するデータを登録　
     */
    //%weight=50
    //% group="SERVER"
    //% block="ID $n文字列$s　(7文字まで)をセット"
    export function  setdatastr(n:lis,s:string){
        list[n] = s


        
 
    }




    
     /**
     * TODO:メッセージのやり取りがあったら実行する
   　
     */
    //%weight=50
    //% group="SERVER"
    //% block="メッセージのやり取りがあったら"
    
    export function onserver(handler:()=>void){
         onxHandler = handler;
        
        
        
    }
    /**
     * TODO:メッセージの内容(形式IPアドレス＋メッセージ)
   　
     */
    //%weight=40
    //% group="SERVER"
    //% block="送出元IPアドレス to 宛先IPアドレス+メッセージの内容の文字列"
    export function  receivedmessage():string　{ 
        let receivedmessage:string;

       
        receivedmessage = "192.168.0."+""+receivedfromip+" to "+"192.168.0."+""+convertToText(receivedtoip)+" "+""+receivedtext;

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
    
    
