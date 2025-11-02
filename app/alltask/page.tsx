"use client";

import Image from "next/image";
import TaskBanner from "../../assets/images/task.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { firestoreDB } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Footer from "@/component/footer";

type tasks = {
  id: string;
  created_at: string; // เดิมสะกด create_at -> ให้ตรงกับ select
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  update_at: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<tasks[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // ดึงข้อมูล
        const data = await getDocs(collection(firestoreDB, "task_cl"));

        // เอาข้อมูลที่ดึงมากำหนดให้กับ state : tasks
        setTasks(
          data.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            detail: doc.data().detail,
            image_url: doc.data().image_url,
            is_completed: doc.data().is_completed,
            created_at: doc.data().created_at?.toDate() ?? null,
            update_at: doc.data().update_at?.toDate() ?? null,
          }))
        );
      } catch (error) {
        console.log("เกืดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
        console.log(error);
        throw error;
      }
    };

    fetchTasks();
  }, []);

  const handleDeletClick = async (id: string) => {
    if (confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) {
      try {
        // ลบข้อมูลใน Firebase
        await deleteDoc(doc(firestoreDB, "task_cl", id));

        // ลบข้อมูลใน state
        setTasks(tasks.filter((task) => task.id !== id));

        alert("ลบงานเรียบร้อยแล้ว");
      } catch (error) {
        console.log("เกืดข้อผิดพลาดในการลบงาน กรุณาลองใหม่อีกครั้ง");
        console.log(error);
        throw error;
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="mt-16"
          src={TaskBanner}
          alt="Task"
          width={200}
          height={200}
        />
        <h1 className="mt-10 text-4xl font-bold text-blue-700">
          Manage Task App
        </h1>
        <h1 className="mt-5 text-2xl text-gray-400">บริการจัดการงานที่ทำ</h1>
        <div className="flex w-10/12 justify-end">
          <Link
            className="mt-5 text-white bg-sky-400 px-8 py-2 rounded hover:bg-sky-300"
            href={"/addtask"}
          >
            เพิ่มงาน
          </Link>
        </div>
        <div className="w-10/12 flex mt-5 ">
          <table className="w-full">
            <thead>
              <tr className="text-center font-bold bg-gray-300">
                <td className="border p-2">รหัส</td>
                <td className="border p-2">งานที่ต้องทำ</td>
                <td className="border p-2">รายละเอียดงาน</td>
                <td className="border p-2">สถานะ</td>
                <td className="border p-2">วันที่เพิ่ม</td>
                <td className="border p-2">วันที่แก้ไข</td>
                <td className="border p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border p-2 text-center">
                    {task.image_url ? (
                      <Image
                        className="mx-auto"
                        src={task.image_url}
                        alt={task.title}
                        width={50}
                        height={50}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2">{task.title}</td>
                  <td className="border p-2">{task.detail}</td>
                  <td className="border p-2">
                    {task.is_completed === true ? "สำเร็จ" : "ไม่สำเร็จ"}
                  </td>
                  <td className="border p-2">
                    {new Date(new Date(task.created_at)).toLocaleString("th-TH")}{" "}
                  </td>
                  <td className="border p-2">
                    {new Date(new Date(task.update_at)).toLocaleString("th-TH")}{" "}
                  </td>
                  <td className="border p-2">
                    <Link
                      className="text-green-500 mr-5 hover:bg-green-600"
                      href={`/updatetask/${task.id}`}
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDeletClick(task.id)}
                      className="text-red-500 cursor-pointer hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
