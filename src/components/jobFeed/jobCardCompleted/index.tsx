import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useState, useEffect } from "react";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaInfoCircle, FaImage, FaUser, FaTimes } from "react-icons/fa";
import { baseUrl } from "@/services/api";

dayjs.extend(relativeTime);

interface Job {
  _id: string;
  title: string;
  price?: number;
  description: string;
  status: string;
  createdAt: string;
  isRated?: boolean;
  location: {
    cep: string;
    street: string;
    city: string;
    state: string;
  };
  workerId?: string;
  workerName?: string;
  clientId?: {
    _id: string;
    fullName: string;
  };
  imageUrl?: string;
  cleanedPhoto?: string;
  completedAt?: string;
  disputeUntil?: string;
}

interface JobCardCompletedProps {
  job: Job;
  onJobUpdate?: (updatedJob: Job) => void;
}

export const JobCardCompleted = ({ job }: JobCardCompletedProps) => {
  const [isRated, setIsRated] = useState<boolean>(job.isRated || false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setIsRated(job.isRated || false);
  }, [job.isRated]);

  let timeMessage = "";
  let diffMinutes = 0;
  if (job.status === "waiting-for-rating" && job.disputeUntil) {
    const disputeTime = dayjs(job.disputeUntil);
    const now = dayjs();
    diffMinutes = disputeTime.diff(now, "minute");
    if (diffMinutes > 0) {
      timeMessage = `Caso não haja nenhuma reclamação, seu pagamento será liberado em até ${diffMinutes} minutos.`;
    } else {
      timeMessage =
        "O período de contestação expirou. O pagamento será liberado em breve.";
    }
  }

  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg";

  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-50 transition">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-shrink-0">
          <img
            src={displayImage}
            alt={job.title}
            className="rounded object-cover w-[200px] h-[150px]"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{job.title}</h3>
          {job.clientId && job.clientId.fullName && (
            <p className="text-sm text-gray-800 mb-2 flex items-center gap-1">
              <FaUser className="text-gray-600" />
              <span className="font-bold">Cliente:</span>{" "}
              {job.clientId.fullName}
            </p>
          )}
          <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
            <FaInfoCircle className="text-gray-600" />
            {job.description}
          </p>
        </div>
      </div>

      <hr className="my-3" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <p className="text-sm text-gray-800">
          <span className="font-bold">Status:</span> {job.status}
        </p>
        <p className="text-sm text-gray-800 flex items-center gap-1">
          <MdCalendarToday className="text-gray-600" />
          <span className="font-bold">Data:</span>{" "}
          {dayjs(job.createdAt).format("DD/MM/YYYY")}
        </p>
        {typeof job.price === "number" && (
          <p className="text-sm text-gray-800 flex items-center gap-1">
            <MdAttachMoney className="text-gray-600" />
            <span className="font-bold">Preço:</span> R$ {job.price.toFixed(2)}
          </p>
        )}
        <p className="text-sm text-gray-800 flex items-start gap-1">
          <MdLocationOn className="text-gray-600 mt-0.5" />
          <span className="font-bold">Local:</span>
          <span>
            Rua {job.location.street}, {job.location.city}/{job.location.state}
          </span>
        </p>
      </div>

      <div className="mt-3 text-sm text-gray-800">
        <p className="font-bold mb-1">Trabalho concluído!</p>
        {job.status === "waiting-for-rating" && (
          <p className="mb-2">{timeMessage}</p>
        )}

        {job.cleanedPhoto && (
          <button
            onClick={() => setModalVisible(true)}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
          >
            <FaImage />
            Ver Imagem
          </button>
        )}
      </div>

      {/* Modal */}
      {modalVisible && job.cleanedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-full max-h-full">
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <img
              src={`${baseUrl}${job.cleanedPhoto}`}
              alt="Área limpa"
              className="max-w-full max-h-[80vh] rounded"
            />
          </div>
        </div>
      )}
    </li>
  );
};
