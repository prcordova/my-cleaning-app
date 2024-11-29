"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(
    null
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [filter, setFilter] = useState("today");
  const [labels, setLabels] = useState<string[]>([]);
  const [cleaningCounts, setCleaningCounts] = useState<number[]>([]);
  const [totalAmounts, setTotalAmounts] = useState<number[]>([]);
  const [cleaningTotal, setCleaningTotal] = useState(0);
  const [amountTotal, setAmountTotal] = useState(0);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter === "custom") {
      setIsCalendarOpen(true);
    } else {
      setIsCalendarOpen(false);
      setSelectedDate(null);
    }
  };

  useEffect(() => {
    const today = dayjs();
    let newLabels: string[] = [];
    let newCleaningCounts: number[] = [];
    let newTotalAmounts: number[] = [];

    if (filter === "today") {
      newLabels = [today.format("DD/MM/YYYY")];
      newCleaningCounts = [Math.floor(Math.random() * 5) + 1];
      newTotalAmounts = [Math.floor(Math.random() * 500) + 100];
    } else if (filter === "month") {
      const startOfMonth = today.startOf("month");
      const endOfMonth = today.endOf("month");

      for (
        let date = startOfMonth;
        date.isBefore(endOfMonth) || date.isSame(endOfMonth);
        date = date.add(1, "day")
      ) {
        newLabels.push(date.format("DD/MM"));
        newCleaningCounts.push(Math.floor(Math.random() * 5) + 1);
        newTotalAmounts.push(Math.floor(Math.random() * 500) + 100);
      }
    } else if (filter === "custom" && selectedDate) {
      if (Array.isArray(selectedDate)) {
        const [start, end] = selectedDate;
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        for (
          let date = startDate;
          date.isBefore(endDate) || date.isSame(endDate);
          date = date.add(1, "day")
        ) {
          newLabels.push(date.format("DD/MM"));
          newCleaningCounts.push(Math.floor(Math.random() * 5) + 1);
          newTotalAmounts.push(Math.floor(Math.random() * 500) + 100);
        }
      } else {
        newLabels = [dayjs(selectedDate).format("DD/MM/YYYY")];
        newCleaningCounts = [Math.floor(Math.random() * 5) + 1];
        newTotalAmounts = [Math.floor(Math.random() * 500) + 100];
      }
    }

    setLabels(newLabels);
    setCleaningCounts(newCleaningCounts);
    setTotalAmounts(newTotalAmounts);
    setCleaningTotal(newCleaningCounts.reduce((acc, val) => acc + val, 0));
    setAmountTotal(newTotalAmounts.reduce((acc, val) => acc + val, 0));
  }, [filter, selectedDate]);

  const cleaningData = {
    labels,
    datasets: [
      {
        label: "Limpezas Realizadas",
        data: cleaningCounts,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const amountData = {
    labels,
    datasets: [
      {
        label: "Valores Arrecadados (R$)",
        data: totalAmounts,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: true },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-primary text-white p-4 rounded">
        <h1 className="text-xl">Dashboard</h1>
      </header>

      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filtrar dados</h2>
        <div className="space-x-2">
          <button
            onClick={() => handleFilterChange("today")}
            className={`px-4 py-2 rounded ${
              filter === "today" ? "bg-secondary text-white" : "bg-gray-200"
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => handleFilterChange("month")}
            className={`px-4 py-2 rounded ${
              filter === "month" ? "bg-secondary text-white" : "bg-gray-200"
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => handleFilterChange("custom")}
            className={`px-4 py-2 rounded ${
              filter === "custom" ? "bg-secondary text-white" : "bg-gray-200"
            }`}
          >
            Data Personalizada
          </button>
        </div>
      </div>

      {isCalendarOpen && (
        <div className="mt-4 bg-white p-4 shadow rounded max-w-md">
          <Calendar
            selectRange={true}
            onChange={(value) => setSelectedDate(value)}
            value={selectedDate}
            className="react-calendar"
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-lg font-bold mb-4">Gráfico de Limpezas</h3>
          <div className="relative h-64">
            <Bar data={cleaningData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-lg font-bold mb-4">Gráfico de Valores</h3>
          <div className="relative h-64">
            <Bar data={amountData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Resumo Total</h3>
        <p className="text-md">Total de Limpezas: {cleaningTotal}</p>
        <p className="text-md">Valor Total: R$ {amountTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Dashboard;
