import React, { useRef } from "react";
import { useState } from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import jsonData from "./data.json";
import Category from "./category";
export default function Filter() {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const [filterData, updateFilterData] = useState({});
  const updateFilter = (key, value) => {
    filterData[key] = value;
    updateFilterData(filterData);
    console.log(filterData);
  };

  const queryBox = useRef();

  return (
    <Card className="h-full max-w-[400px] rounded-r-none border-2">
      <CardHeader
        floated={false}
        className="h-[50px] rounded-none border-b-4 border-gray-500 pb-5 shadow-none"
      >
        <Typography variant="h4">Screener</Typography>
      </CardHeader>
      <CardBody className="h-[90%] overflow-auto" divider={true}>
        <Textarea
          inputRef={queryBox}
          label="Write Your Query"
          onChange={(event) => {
            updateFilter("query", event.target.value);
          }}
        />
        {jsonData.map((item, index) => {
          return (
            <Category
              isSub={false}
              title={item.title}
              type={item.type}
              data={item.data}
              updateFunc={updateFilter}
              id={index + 1}
              isOpen={open === index + 1}
              handleOpen={handleOpen}
            />
          );
        })}
        {/* <Accordion
          open={open === 1}
          icon={<ChevronDownIcon strokeWidth={2.5} />}
          className={`
        transition-transform ${open === 1 ? "rtoate-180" : ""}
        `}
        >
          <AccordionHeader>Screener</AccordionHeader>
        </Accordion> */}
      </CardBody>
      <CardFooter divider={true} className="flex items-center justify-center">
        <div>
          <Button
            onClick={() => {
              console.log(filterData);
            }}
            label="Apply Filter"
          >
            Apply Filter{" "}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
