import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import SettingsContext from "@/contexts/settings";
import { classNames } from "@/modules/functions/css";
import { debounce } from "@/modules/functions/time";
import tw from "@/modules/tailwind";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ApexLineChartProps = {
  series: ApexAxisChartSeries;
  className?: string;
  height?: number;
  title?: React.ReactNode;
  color?: string;
};

export default function ApexLineChart({
  series,
  className,
  height,
  title,
  color = tw.colors.red["500"],
  ...props
}: ApexLineChartProps) {
  const {
    settings: { darkMode },
  } = useContext(SettingsContext);

  var initialOptions: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Open Sans, sans-serif",
      events: {
        mounted: function (chartContext, config) {
          // chartContext.updateOptions({ markers: { size: 10 } });
        },
      },
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: -40,
        tools: {
          download: false,
          zoom: false,
          zoomin: renderToString(
            <div className="p-2 h-full bg-gray-200 dark:bg-gray-700 rounded-full">
              <PlusIcon className="h-4 w-4" />
            </div>
          ),
          zoomout: renderToString(
            <div className="p-2 h-full bg-gray-200 dark:bg-gray-700 rounded-full">
              <MinusIcon className="h-4 w-4" />
            </div>
          ),
          pan: "<span></span>",
          reset: false,
          customIcons: [],
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ",",
            headerCategory: "category",
            headerValue: "value",
            dateFormatter(timestamp) {
              return new Date(timestamp ?? "").toDateString();
            },
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          },
        },
        autoSelected: "pan",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [color],
    markers: {
      size: 0,
      colors: [color],
      hover: {
        sizeOffset: 1,
      },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return renderToString(
          <div className="px-4 rounded-xl py-2 flex text-center justify-center bg-white dark:bg-gray-900 ring-gray-200 dark:ring-gray-700 ring-1 ring-inset">
            {series[seriesIndex][dataPointIndex]}
          </div>
        );
      },
      x: {
        show: false,
        format: "MMM dd",
      },
      followCursor: false,
      style: {
        fontSize: tw.fontSize.xs[0],
      },
    },
    grid: {
      borderColor: darkMode ? tw.colors.gray["700"] : tw.colors.gray["300"],
      row: {
        colors: [
          darkMode ? tw.colors.gray["800"] : tw.colors.gray["100"],
          "transparent",
        ], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          fontWeight: tw.fontWeight["semibold"], // normal
          fontSize: "0.875rem", // text-sm
          colors: tw.colors.gray["500"],
        },
        offsetY: 5,
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "MMM d",
          hour: "HH:mm",
        },
      },
      axisBorder: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      max: (max) => max + 1,
      labels: {
        style: {
          fontWeight: tw.fontWeight["semibold"], // normal
          fontSize: "0.875rem", // text-sm
          colors: tw.colors.gray["500"],
        },
        formatter: function (val) {
          return val.toFixed(0);
        },
        offsetX: -10,
      },
      forceNiceScale: true,
      showForNullSeries: false,
    },
  };
  const [options, setOptions] = useState<ApexOptions>(initialOptions);

  useEffect(() => {
    debounce(() => {
      setOptions({
        ...options,
        markers: {
          size: 6,
          hover: { sizeOffset: 1 },
        },
      });
    }, 1000)();
  }, []);

  return (
    <div
      className={classNames(
        "h-[390px] overflow-x-clip pt-4 min-w-[300px] flex flex-col px-4",
        className
      )}
      onMouseEnter={() =>
        setOptions(
          Object.assign({}, options, { chart: { toolbar: { show: true } } })
        )
      }
      onMouseLeave={() =>
        setOptions(
          Object.assign({}, options, { chart: { toolbar: { show: false } } })
        )
      }
    >
      {title}
      {!series[0].data ? null : (
        <Chart
          className="flex flex-1 tracking-wide"
          options={options}
          series={series}
          type="line"
          height={height}
        />
      )}
    </div>
  );
}
