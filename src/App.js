import { useEffect, useState } from 'react';
import './App.css';

let pkg = require('../package.json');

const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = useState(
    localStorage.getItem(localStorageKey) || ''
  );

  useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

const coupon_options = [
  {
    "label": "請選擇",
    "value": "",
    "expire": new Date()
  },
  {
    "label": "～6/7 酷幣1,000",
    "value": "REWARD001",
    "expire": new Date("2021-06-07")
  },
  {
    "label": "～7/18 平底鍋背飾、酷幣500、金幣10,000",
    "value": "KARTANDPUBG",
    "expire": new Date("2021-07-18")
  },
  {
    "label": "～7/31 限時車手、裝、車",
    "value": "USANDRIDERSTOGETHER",
    "expire": new Date("2021-07-31")
  },
  {
    "label": "～8/31 能量水晶2,000、酷幣500、金幣1,000",
    "value": "SURVEYREWARD",
    "expire": new Date("2021-08-31")
  },
  {
    "label": "～8/31 頭飾、熊美氣球30、酷幣1,000",
    "value": "KRRPLINEFRIENDS",
    "expire": new Date("2021-08-31")
  }
]

function App() {
  // const [options, setOptions] = useState([]);
  const [couponNum, setCouponNum] = useState('');
  const [npaCode, setNpaCode] = useStateWithLocalStorage('kartrush-npaCode');

  // useEffect(() => {
  //   fetch(`https://raw.githubusercontent.com/orangecat/kr-coupon/main/data.json`)
  //     .then(res => res.json())
  //     .then(data => setOptions(data))
  //     .catch(err => alert(err))
  // }, [])

  const handleSubmit = () => {
    if (couponNum.trim() === "" || npaCode.trim() === "") {
      alert('請輸入/選擇完整資訊')
    } else if (npaCode.trim().length !== 13) {
      alert(`請輸入正確的會員號碼。`)
    } else {
      fetch(`https://mcoupon.nexon.com/kartrush/findUserNpa`, {
        method: 'POST',
        body: JSON.stringify({
          "npaCode": npaCode,
          "couponNum": couponNum,
          "region": "TW"
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            const { id, name } = data.info[0]
            fetch(`https://mcoupon.nexon.com/kartrush/useGiftCoupon`, {
              method: 'POST',
              body: JSON.stringify({
                npaCode: npaCode,
                couponNum: couponNum,
                id: id,
                name: name,
                region: "TW"
              }),
              headers: new Headers({
                'Content-Type': 'application/json'
              })
            })
              .then(res => res.json())
              .then(d => {
                if (d.result) {
                  alert(`Hi ${name}\n禮券使用完畢\n道具將發送至信箱，\n發送至信箱需要些許時間。\n系統回覆：${d.message}`)
                } else if (d.code === 88888) {
	          alert(`發生了意外的錯誤。\n請重新整理或重新連線後，再次按下按鍵。\n系統回覆：${d.message}`)
	 	} else {
                  alert(`已使用過的優惠券。\n請確認號碼後重新輸入。\n系統回覆：${d.message}`)
                }
              })
          } else {
            if (data.code === 90421) {
              alert(`請輸入正確的會員號碼。\n系統回覆：${data.message}`)
            } else {
              alert(`已使用過的優惠券。\n請確認號碼後重新輸入。\n系統回覆：${data.message}`)
            }
          }
        })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        會員編號：
        <input
          type="text"
          value={npaCode}
          maxLength={13}
          onChange={(e) => {
            let value = e.target.value
            setNpaCode(value)
            localStorage.setItem('kartrush-npaCode', value)
          }}
        />
        <br />
        <select value={couponNum} onChange={e => setCouponNum(e.target.value)}>
	  <optgroup>
          {coupon_options.map((o, i) =>{ 
	    Date.prototype.yyyymmdd = function() {
	      let mm = this.getMonth() + 1; // getMonth() is zero-based
	      let dd = this.getDate();

	      return [this.getFullYear(),
		  (mm>9 ? '' : '0') + mm,
		  (dd>9 ? '' : '0') + dd
	 	 ].join('');
	    };
	    if (new Date(o.expire).yyyymmdd() < new Date().yyyymmdd()) return;
	    return (<option value={o.value}>{o.label} {o.value && `- ${o.value}`}</option>)
	  })}
	  </optgroup>
        </select>
        <br />
        <input type="button" value="送出" onClick={handleSubmit} />
	<br />
	<span>最後更新時間:2021-06-06 18:56</span>
	<span onClick={()=>window.open("https://github.com/orangecat/kr")}>點我看程式碼</span>
	  <div onClick={()=>window.location.reload()}>點我重新整理</div><br/><br/>
      </header>
    </div>
  );
}

export default App;
