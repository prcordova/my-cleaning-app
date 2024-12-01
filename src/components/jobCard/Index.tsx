// components/JobCard.tsx
import dayjs from "dayjs";
interface JobCardProps {
  onClick: () => void;
  job: {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    location: {
      street: string;

      city: string;
      state: string;
    };
  };
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-300 ">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p>{job.description}</p>
      <p>Status: {job.status}</p>
      <p>Criado em: {dayjs(job.createdAt).format("DD/MM/YYYY")}</p>
      <p>
        Endereço:
        <span className="font-semibold">
          {" "}
          Rua: {job.location.street}, Cidade: {job.location.city}, Estado:{" "}
          {job.location.state}
        </span>
      </p>
      <button
        onClick={onClick}
        className="bg-primary text-white px-4 py-2 rounded-lg mt-2"
      >
        Candidatar-se
      </button>
    </li>
  );
};
