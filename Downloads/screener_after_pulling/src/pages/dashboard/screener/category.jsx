import React, { useState } from "react";
import {
  Card,
  Typography,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  CardHeader,
  CardBody,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Type from "./type";

export default function Category(props) {
  const [filterData, setFilterData] = useState({});
  const updateFilterData = (key, value) => {
    filterData[key] = value;
    setFilterData(filterData);
    props.updateFunc(props.title, filterData);
  };
  const [isChecked, setCheck] = useState(false);
  const [_, updateScreen] = useState(0);
  const getVal = (key) => {
    console.log(filterData);
    return filterData[key];
  };
  return (
    <Accordion
      open={props.isOpen}
      icon={
        <ChevronDownIcon
          strokeWidth={2.5}
          className={`
      transition-transform ${props.isOpen ? "rotate-180" : ""}
      `}
        />
      }
      className=" overflow-hidden border-y-[1px]"
    >
      <AccordionHeader
        onClick={() => props.handleOpen(props.id)}
        className="border-y-[0px]"
      >
        <div className="flex items-center">
          {props.isSub === true ? (
            <Checkbox
              onClick={() => {
                setCheck(!isChecked);
                props.data.forEach((item) => {
                  updateFilterData(item, isChecked);
                });
                console.log(filterData);
              }}
              type="checkbox"
            />
          ) : (
            ""
          )}
          <Typography variant={props.isSub ? "h6" : "h5"}>
            {props.title}
          </Typography>
        </div>
      </AccordionHeader>
      <AccordionBody
        className={`!h-[full] ${props.isOpen === true ? "border-t-[1px]" : ""}`}
      >
        <Type
          type={props.type}
          data={props.data}
          updateFunc={(key, value) => {
            filterData[key] = value;
            setFilterData(filterData);
            props.updateFunc(props.title, filterData);
          }}
          getVal={getVal}
          updateScreen={updateScreen}
        />
      </AccordionBody>
    </Accordion>
  );
}
