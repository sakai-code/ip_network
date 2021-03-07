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
    //%block="9"
    nine = 9
    

    



}

//% weight=100 color=#0fbc11 icon="\uf1eb"
//% groups="['LAN', 'SERVER','IOT']"
namespace IP_NETWORK {
 
    let receivedtoip = 0
    let receivedfromip = ""
    let setgflags = 0
    let receivednumber = 0
    let myipaddress = 0
    let makestring = "" 
    let receivedtext = ""
    
    let targetvalue = 0
    let list = ["NODATA","NODATA","NODATA","NODATA","NODATA","NODATA","NODATA","NODATA","NODATA","NODATA"]
    let onxHandler:  (name :string,value:number) => void
    let initHandler: (a:number) =>void 

   function setinit(handler:()=>void){

        onxHandler = handler　//エラー対策
    }
      function setinit2(handler:()=>void){

        initHandler = handler //エラー対策
    }

   setinit(function(){})
   setinit2(function(){})

 
    

    //%block="グループ番号$nでデバイスのIPアドレスを192.168.0.$xにする"
    //%weight=100
    //% group="LAN"
    //% n.min=1 n.max=99 n.defl=1
    //% x.min=1 x.max=99 x.defl=1   
     /**
     * TODO:デバイスのIPアドレスを定めて初期化
     */
    export function oninit(n:number,x:number){
        initHandler(1)
        radio.setGroup(n)
        myipaddress = x
        let flags = 0
        let tempstr = ""
        radio.onReceivedNumber(function (receivedNumber: number) {
         
          
            if( receivedNumber == x){
                flags = 1

            }
            
        })

        radio.onReceivedString(function (receivedString: string) {
            tempstr = receivedString
            
            if (flags == 1){
             
                
                if(tempstr.substr(1,12) == "REQUESTDATA:"){
                receivedtext =""
                receivedfromip = tempstr.substr(0,1)                 
                let  data = parseInt(tempstr.substr(13,1))
                let toip = 　parseInt( receivedfromip)
                radio.sendNumber(toip)
                basic.pause(5)
                makestring =""+ convertToText(myipaddress)+""+ list[data];
                basic.pause(5)
                radio.sendString(makestring)
                flags = 0
                receivedtext = ""
                tempstr =""
                    
 

                }else{
                receivedtext = tempstr.substr(1,17)

                receivedfromip = tempstr.substr(0,1)
                
             
                onxHandler(receivedtext,1)
                flags= 0
                tempstr =  ""
                
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
    //% block="デバイス宛に文字列 $receivedtext を受け取ったら実行する"
    export function onreceived(handler:(receivedtext :string)=> void){
        onxHandler = handler
      
    }
    /**
     * TODO:受信したIPアドレス宛にメッセージを返す。
   　
     */
    //%weight=89
    //% group="LAN"
    //% block="受信したIPアドレス宛に文字列を $t を返す。"

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

        receivedtext = ""




    }
    /**
     * TODO:サーバーにID　Xのデータを問い合わせる
   　
     */
    //%weight=60
    //% group="IOT"
    //% DATA.defl=receivedtext
    //% draggableParameters="reporter"
     //% block="サーバーに　ID $nのデータを問い合わせる"
    export function askdata(n:lis):void{ 
        let zero = 0
        radio.sendNumber(zero)
        makestring =""+ convertToText(myipaddress)+"REQUESTDATA:"+""+ convertToText(n);
        radio.sendString(makestring)

        basic.pause(5)
        


        
       




    }
      /**
     * TODO:IPアドレス192.168.0.Xに登録されたデータを問い合わせる
   　
     */
    //%weight=80
    //% group="IOT"
    //% DATA.defl=receivedtext
    //% s.defl=1 s.min=1 s.max=99
    //% draggableParameters="reporter"
     //% block="192.168.0.$sに　ID $nのデータを問い合わせる"
    export function askdataip(n:lis,s:number):void　{ 
        radio.sendNumber(s)
        makestring =""+ convertToText(myipaddress)+"REQUESTDATA:"+""+ convertToText(n);
        basic.pause(5)
        radio.sendString(makestring)

        basic.pause(5)
       


        
       




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
    //% block="IPアドレス192.168.0. $n に文字列 $y　（17文字までの英数字）"
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
     * TODO:グループXのサーバーになりサーバーに文字列の流れを監視する
   　
     */
    //%weight=60
    //% group="SERVER"
    //% block="グループ番号$n、192.168.0.0のサーバーになり、文字列の流れを見る"
    //% n.min=1 n.max=99 n.defl=1
    export function server(n:number){
        radio.setGroup(n)
        setgflags = 0
        myipaddress = 0
         radio.onReceivedNumber(function (receivedNumber: number) {
             
             
         
            if(setgflags == 0){
                setgflags = 1
                receivedtoip = receivedNumber
　　　　　　　　　if(receivedNumber == myipaddress){  
                targetvalue = 1  


            }else{ targetvalue = 0}
            


            }
           
            
        })

        radio.onReceivedString(function (receivedString: string) {
            initHandler(1)
            let tempstr = receivedString
            if (setgflags == 1){
                let data = 0
               
                if(targetvalue == 1){
                if(tempstr.substr(1,12) == "REQUESTDATA:"){
                
                data = parseInt(tempstr.substr(13,1))          
                let toip = 　parseInt( tempstr.substr(0,1))
                radio.sendNumber(toip)
                receivedfromip = tempstr.substr(0,1)
                basic.pause(5)
                makestring =""+ convertToText(myipaddress)+""+ list[data];
                radio.sendString(makestring)
                setgflags = 0
                
                receivedtext = tempstr.substr(1,17)
                receivedfromip = tempstr.substr(0,1)


              onxHandler(receivedtext,1)

               basic.pause(5)

               receivedtoip =  toip 
               receivedfromip = convertToText(myipaddress)
               
               receivedtext = list[data]

               onxHandler(receivedtext,1)
               targetvalue = 0 

               


               
            
                
                }
                    
                }else{
                receivedtext = tempstr.substr(1,17)
                receivedfromip = tempstr.substr(0,1)
             
                onxHandler(receivedtext,1)
                setgflags= 0
                targetvalue = 0
                }

                

            }

            
            
        })

   
      
        
    }
      /**
     * TODO:　サーバー内にデータをセットし、リクエストがあったら応える　
     */
    //%weight=50
    //% group="IOT"
    //% block="データをセットしておく"
    export function iot(handler:()=>void){
        initHandler = handler
 
    }
      /**
     * TODO:応答するIDと対応するデータを登録　
     */
    //%weight=50
    //% group="IOT"
    //% block="ID $nに数字%mをセット（自動的に文字列として保存）"
    export function  setdata(n:lis,m:number){
        list[n] = convertToText(m)


        
 
    }
        /**
     * TODO:応答するIDと対応するデータを登録　
     */
    //%weight=50
    //% group="IOT"
    //% block="ID $n文字列$s　（15文字までの英数字）をセット"
    export function  setdatastr(n:lis,s:string){
        list[n] = s


        
 
    }




    
     /**
     * TODO:メッセージのやり取りがあったら実行する
   　
     */
    //%weight=50
    //% group="SERVER"
    //% block=グループ内で情報のやり取りがあったら"
    
    export function onserver(handler:()=>void){
         onxHandler = handler;
        
        
        
    }
    /**
     * TODO:メッセージの内容(形式IPアドレス＋メッセージ)
   　
     */
    //%weight=40
    //% group="SERVER"
    //% block="送出元IPアドレス to 宛先IPアドレス+文字列"
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
    
    
