import React from "react";
import { prisma } from "./lib/prisma";
import { Status } from "@prisma/client";
import Link from "next/link";
import SelectStatus from "./components/Select/SelectStatus";

interface IListOfTask {
  createdAt: Date;
  description: string;
  id: number;
  status: Status;
  title: string;
  updatedAt: Date;
}

const HomePage: React.FC = async () => {
  try {
    const response = await prisma.task.findMany();
    const data: IListOfTask[] = response;
    // console.log("data", data);

    return (
      <div className="container mx-auto p-4">
        <table className="table w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Created At</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={d.id} className="border border-gray-300 text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{d.title}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(d.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  <SelectStatus id={d.id} initialStatus={d.status} />
                </td>
                <td className="border border-gray-300 p-2">
                  <Link
                    href={`/task/details/${d.id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return (
      <div className="text-red-500">
        Failed to load tasks. Please try again later.
      </div>
    );
  }
};

export default HomePage;
