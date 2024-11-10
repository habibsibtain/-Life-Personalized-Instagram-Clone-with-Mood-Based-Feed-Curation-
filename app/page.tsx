import FeedCard from "@/components/FeedCard";
import MainLayout from "@/Layouts/MainLayout";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <MainLayout>
        <div className="flex justify-center min-h-screen ml-60 px-40 py-2">
          <FeedCard />
        </div>
      </MainLayout>
    </>
  );
}
