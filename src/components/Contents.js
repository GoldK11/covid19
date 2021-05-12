import { useState, useEffect, React } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import axios from "axios";

const Contents = (props) => {
  const [confirmedData, setConfirmedData] = useState({});
  const [activeData, setActiveData] = useState({});
  const [summarydData, setSummarydData] = useState({});

  const chartsInfos = {
    confirmed: { title: "누적 확진자", data: confirmedData, component: Bar },
    active: { title: "월별 격리자", data: activeData, component: Line },
    summary: { title: "통계", data: summarydData, component: Doughnut },
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(props.url);
      makeData(res.data);
    };
    const makeData = (items) => {
      let result = items.reduce(
        (acc, cur) => {
          const [month, confirmed, active, death, recovered] = [
            new Date(cur.Date).getMonth(),
            cur.Confirmed,
            cur.Active,
            cur.Deaths,
            cur.Recovered,
          ];
          acc.date[month] = `${month + 1}월`;
          acc.confirmed[month] = confirmed;
          acc.active[month] = active;
          acc.death[month] = death;
          acc.recovered[month] = recovered;
          return acc;
        },
        { date: [], confirmed: [], active: [], death: [], recovered: [] }
      );

      setConfirmedData({
        labels: result.date,
        datasets: [
          {
            label: "누적 확진자",
            backgroundColor: "salmon",
            fill: true,
            data: result.confirmed,
          },
        ],
      });
      setActiveData({
        labels: result.date,
        datasets: [
          {
            label: "월별 격리자",
            borderColor: "#adadf8",
            fill: false,
            data: result.active,
          },
        ],
      });
      setSummarydData({
        labels: ["누적 확진자", "사망", "격리해제"],
        datasets: [
          {
            label: "통계",
            backgroundColor: ["#6287da", "#5eac76", "#ee6e91"],
            data: [
              result.confirmed[11],
              result.death[11],
              result.recovered[11],
            ],
          },
        ],
      });
    };

    fetchEvents();
  }, [props]);
  // 중요  useEffect의 두번째 인자!!!!!!

  let myComponent = Object.keys(chartsInfos).map((key) => {
    const ChartComponent = chartsInfos[key].component;
    const chartOptions = {
      plugins: {
        title: { display: true, text: chartsInfos[key].title, fontSize: 24 },
        legend: { display: true, position: "bottom" },
      },
      maintainAspectRatio: false,
    };
    return (
      <div key={key} className="chart">
        <ChartComponent data={chartsInfos[key].data} options={chartOptions} />
      </div>
    );
  });

  return (
    <section>
      <h2>국내 코로나 현황</h2>
      <div className="contents">{myComponent}</div>
    </section>
  );
};

export default Contents;
