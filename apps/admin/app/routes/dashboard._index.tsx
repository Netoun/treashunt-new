import { Button } from "@/ui/components/atoms/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/atoms/card";
import { FlagIcon, Gamepad2Icon } from "@/ui/icons";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { scenarioService } from "@treashunt/business";
import { getUser } from "~/modules/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Treashunt" },
    {
      name: "description",
      content:
        "Treashunt is a web application that allows you to create and play treasure hunts.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  const scenarios = await scenarioService.getScenarioList({
    authorId: String(user?.id),
  });

  return json({ scenarios });
};

export default function Dashboard() {
  const { scenarios } = useLoaderData<typeof loader>();
  return (
    <div className="p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            Bienvenue sur votre tableau de bord
          </h1>
          <p className="mt-2 text-muted-foreground">
            Vous pouvez voir ici la liste de vos scénarios.
          </p>
        </div>
        <div>
          <Button className="mt-4" asChild>
            <Link to="/scenarios/create">Créer un nouveau scénario</Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-4 max-w-screen-2xl">
        {scenarios.map((scenario) => (
          <Link key={scenario.id} className="group" to={`./${scenario.slug}`}>
            <Card
              key={scenario.id}
              className="flex flex-col group-hover:shadow-lg transition-shadow duration-300 group-hover:bg-primary/5 min-h-40"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {scenario.name}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <div className="w-full flex justify-between gap-2">
                  <div className="flex flex-col md:flex-row gap-3">
                    <p className="text-sm text-muted-foreground">
                      <FlagIcon className="inline-flex size-5 mr-1" />{" "}
                      {scenario.puzzles.length} énigmes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Gamepad2Icon className="inline-flex size-5 mr-1" />{" "}
                      {scenario.games.length} parties
                    </p>
                  </div>

                  <p className="mt-auto text-sm text-muted-foreground">
                    Créé le {new Date(scenario.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
