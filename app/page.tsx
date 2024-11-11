import FeedCard from "@/components/FeedCard";
import MainLayout from "@/Layouts/MainLayout";

export default function Home() {
  return (
    <>
      <MainLayout>
        <div className="flex justify-center min-h-screen lg:ml-60 lg:px-40 lg:py-2 ">
          <FeedCard />
        </div>
      </MainLayout>
    </>
  );
}
