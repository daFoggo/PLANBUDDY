import { IPageTitle } from "@/types/page-title";

const PageTitle = ({ name, icon }: IPageTitle) => {
  return (
    <div className="flex gap-2 items-center">
      {icon}
      <h1 className="text-3xl font-bold">{name}</h1>
    </div>
  );
};

export default PageTitle;
