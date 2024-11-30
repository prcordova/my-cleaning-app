// components/JobCard.tsx
import dayjs from "dayjs";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <li className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p>{job.description}</p>
      <p>Status: {job.status}</p>
      <p>Criado em: {dayjs(job.createdAt).format("DD/MM/YYYY")}</p>
    </li>
  );
};
