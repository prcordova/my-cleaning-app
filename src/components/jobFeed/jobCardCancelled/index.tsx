// components/jobFeed/jobCard/JobCardCancelled.tsx

import dayjs from "dayjs";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaUser, FaInfoCircle } from "react-icons/fa";

interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  price: number;
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

interface JobCardCancelledProps {
  job: Job;
}

export const JobCardCancelled = ({ job }: JobCardCancelledProps) => {
  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg";

  return (
    <li className="bg-gray-200 p-4 rounded shadow-md">
      {/* Topo: Imagem e Título */}
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

      {/* Informações Extras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <p className="text-sm text-gray-800">
          <span className="font-bold">Status:</span> {job.status}
        </p>
        <p className="text-sm text-gray-800 flex items-center gap-1">
          <MdCalendarToday className="text-gray-600" />
          <span className="font-bold">Data:</span>{" "}
          {dayjs(job.createdAt).format("DD/MM/YYYY")}
        </p>
        <p className="text-sm text-gray-800 flex items-center gap-1">
          <MdAttachMoney className="text-gray-600" />
          <span className="font-bold">Preço:</span> R$ {job.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-800 flex items-start gap-1">
          <MdLocationOn className="text-gray-600 mt-0.5" />
          <span className="font-bold">Local:</span>
          <span>
            Rua {job.location.street}, {job.location.city}/{job.location.state}
          </span>
        </p>
      </div>

      {/* Mensagem de Cancelamento */}
      <div className="mt-3 text-sm text-gray-800">
        <p className="font-bold mb-1 text-red-600">
          Este trabalho foi cancelado.
        </p>
      </div>
    </li>
  );
};
