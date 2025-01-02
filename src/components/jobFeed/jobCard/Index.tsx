// components/jobFeed/JobCard.tsx
import dayjs from "dayjs";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaUser, FaInfoCircle } from "react-icons/fa";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  statusColor?: string;
  customMessage?: React.ReactNode;
  customFooter?: React.ReactNode;
  onImageClick?: () => void;
}

export const JobCard = ({
  job,
  statusColor = "bg-white",
  customMessage,
  customFooter,
  onImageClick,
}: JobCardProps) => {
  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg";

  return (
    <li
      className={`${statusColor} p-4 rounded shadow-md hover:bg-gray-50 transition`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-shrink-0">
          <img
            src={displayImage}
            alt={job.title}
            className="rounded object-cover w-[200px] h-[150px]"
            onClick={onImageClick}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{job.title}</h3>
          {job.clientId?.fullName && (
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
        {job.price && (
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

      {customMessage && (
        <div className="mt-3 text-sm text-gray-800">{customMessage}</div>
      )}

      {customFooter && <div className="mt-4">{customFooter}</div>}
    </li>
  );
};
