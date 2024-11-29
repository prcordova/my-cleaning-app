import { Line } from "react-chartjs-2";

export default function Graph({ data }: { data: any }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Estatísticas de Limpeza</h2>
      <Line
        data={{
          labels: data.labels,
          datasets: [
            {
              label: "Gastos Mensais",
              data: data.values,
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
