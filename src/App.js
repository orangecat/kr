import { useEffect, useState } from 'react';
import './App.css';

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
    "value": ""
  },
  {
    "label": "～6/7 酷幣1,000",
    "value": "REWARD001"
  },
  {
    "label": "～7/18 平底鍋背飾、酷幣500、金幣10,000",
    "value": "KARTANDPUBG"
  },
  {
    "label": "～7/31 限時車手、裝、車",
    "value": "USANDRIDERSTOGETHER"
  },
  {
    "label": "～8/31 能量水晶2,000、酷幣500、金幣1,000",
    "value": "SURVEYREWARD"
  },
  {
    "label": "～8/31 頭飾、熊美氣球30、酷幣1,000",
    "value": "KRRPLINEFRIENDS"
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
                  alert(`禮券使用完畢\n道具將發送至信箱，\n發送至信箱需要些許時間。\n系統回覆：${d.message}`)
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
          {coupon_options.map((o, i) => (<option key={i} value={o.value}>{o.label}</option>))}
        </select>
        <br />
        <input type="button" value="送出" onClick={handleSubmit} />
      </header>
    </div>
  );
}

export default App;
