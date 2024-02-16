import { formatNumber } from "@/lib/utils";
import Image from "next/image";

const StatsCard = ({ imgUrl, value, title }: any) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt="badge" width={40} height={40} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

interface StatsProps {
  totalAnswers: number | undefined;
  totalQuestions: number | undefined;
}
const Stats = ({ totalAnswers, totalQuestions }: StatsProps) => {
  return (
    <div className="mt-10 ">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="text-dark400_light700">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/Gold.svg"
          value={formatNumber(0)}
          title="Gold Badges"
        />
        <StatsCard
          imgUrl="/Silver.svg"
          value={formatNumber(0)}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/Bronze.svg"
          value={formatNumber(0)}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
