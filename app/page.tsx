import Image from "next/image";
import Task from "../assets/images/task.png";
import Link from "next/link";
import Footer from "@/component/footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="mt-15"
          src={Task}
          alt="Task"
          width={200}
          height={200}
        />
        <h1 className="mt-10 text-4xl font-bold text-blue-700">
          Manage Task App by FireBase
        </h1>

        <h1 className="mt-5 text-2xl text-gray-400">บริการจัดการงานที่ทำ</h1>
        <Link
          href="/alltask"
          className="bg-sky-400  mt-10 px-25 py-4 rounded text-white"
        >
          เข้าใช้งานแอปพลิเคชั่น
        </Link>
      </div>
      <Footer />
    </>
  );
}
