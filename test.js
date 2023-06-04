// const portal_id =  '33167'
// const prop_id = '556300709'
// const uid =  '1563708'
// const aid =  '1563708'
// const cid = ''
// const ea = 'click'
// const en = 'click_tracking'
// const ec = 'advertising'
// const items = '%5B%5D'
// const dims = '%7B%22campaign%22%3A%7B%22id%22%3A%221164646%22%7D%2C%22story%22%3A%7B%22id%22%3A%221164605%22%7D%2C%22variant%22%3A%7B%22id%22%3A%221164647%22%7D%2C%22destination%22%3A%7B%22id%22%3A%221164577%22%7D%2C%22channel%22%3A%7B%22id%22%3A%229%22%7D%2C%22customers%22%3A%7B%22customer_id%22%3A%22189%22%7D%7D'
// const is_debug= 1
// const extra = '%7B%22target_segment_ids%22%3A%5B111%5D%7D'
// const delivery_src = 'antsomi'
// const is_server = 'false'
// const resp_type = 'redirect'
// const redirect_url =  'https://google.com'

// let url = `https://sandbox-a.cdp.asia/event?portal_id=${portal_id}&prop_id=${prop_id}&uid=${uid}&aid=${aid}&cid=${cid}&ea=${ea}&en=${en}&ec=${ec}&item=${items}&dims=${dims}&is_debug=${is_debug}&extra=${extra}&delivery_src=${delivery_src}&resp_type=${resp_type}&redirect_url=${redirect_url}`;

// console.log(url.length);

// let str = '{"events_tracked_time":{"dataType":"DATE","aggregationType":"none","semanticType":"YEAR_MONTH_DAY","formula":null,"isCustomField":false,"sourceName":"events_tracked_time","inputFormula":null}';


// // https://sandbox-a.cdp.asia/event?portal_id=33167&prop_id=556300709&uid=1563708&aid=1563708&cid=&ea=click&en=click_tracking&ec=advertising&resp_type=redirect&redirect_url=https://google.com



// // https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?SmsType=23&CallbackUrl=https://sandbox-destination-server.cdp.asia/wh/33167/1164130&IsUnicode=1&Phone=84968856820&ApiKey=C6034987452F599EA6107BE1BB4378&Brandname=HOANG%20PHUC%20International&SecretKey=709DCA84EDE39EF054E2F284F5CC90&Content=Hello&OTTLabel=click%20it&OTTImgUrl=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1680028256635-17e7f3ebbb23%3Fixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D%26auto%3Dformat%26fit%3Dcrop%26w%3D1169%26q%3D80&OTTUrl=https%3A%2F%2Fsandbox-a.cdp.asia%2Fevent%3Fportal_id%3D33167%26prop_id%3D556300709%26uid%3D1564106%26aid%3D1564106%26cid%3D%26ea%3Dclick%26en%3Dclick_tracking%26ec%3Dadvertising%26items%3D%255B%255D%26dims%3D%257B%2522campaign%2522%253A%257B%2522id%2522%253A%25221164983%2522%257D%252C%2522story%2522%253A%257B%2522id%2522%253A%25221164982%2522%257D%252C%2522variant%2522%253A%257B%2522id%2522%253A%25221164984%2522%257D%252C%2522destination%2522%253A%257B%2522id%2522%253A%25221164577%2522%257D%252C%2522channel%2522%253A%257B%2522id%2522%253A%25229%2522%257D%252C%2522customers%2522%253A%257B%2522customer_id%2522%253A%2522195%2522%257D%257D%26is_debug%3D1%26extra%3D%257B%2522target_segment_ids%2522%253A%255B1055551%255D%257D%26delivery_src%3Dantsomi%26is_server%3Dtrue%26resp_type%3Dredirect%26redirect_url%3Dhttp%253A%252F%252Fgoogle.com



const writeFile = async (portalId, destinationId, obj) => {
    console.log(obj);
    let url = `https://sandbox-destination-server.cdp.asia/file-transfer/write-file?portalId=${portalId}&destinationId=${destinationId}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: obj,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };
  
  const portalId = 33167;
  const destinationId = 1170434;
  console.log('start');
  
  const processWriteFile = async () => {
    for (let i = 1; i <= 1000; i++) {
      let obj = {
        line_id: `${i}`,
        content: 'content',
        coupon_code: 'coupon'
      };
  
      await writeFile(portalId, destinationId, JSON.stringify(obj));
    }
  
    console.log('end');
  };
  
  processWriteFile();

