import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";

import logo from "./assets/logo.png";

import {
  always,
  append,
  compose,
  concat,
  evolve,
  filter,
  map,
  max,
  min,
  reduce,
  uniq,
  assoc,
  Evolver,
  where,
  gte,
  both,
  lte,
  pipe,
  equals,
  isNil,
  not,
  includes,
  flip,
  any,
  toLower
} from "ramda";

import { FastImageImage } from "react-fast-image";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import classNames from "classnames";

import { Launch, Filters } from "./types";
import Spinner from "react-spinkit";

interface SiteHeaderProps {
  loading: boolean;
  searchTerm: string;
  onSearchByName: (e: ChangeEvent<HTMLInputElement>) => void;
}

function SiteHeader({ onSearchByName, searchTerm, loading }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  function onToggle() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="xl:flex-shrink-0">
      <header className="bg-black sm:flex sm:items-center sm:justify-between xl:bg-white">
        <div className="flex justify-between px-4 py-3 xl:w-72 xl:bg-black xl:justify-center xl:py-5">
          <div>
            <img src={logo} alt="logo" />
          </div>
          <div className="flex sm:hidden">
            <button
              onClick={onToggle}
              type="button"
              className="px-2 text-gray-500 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        <nav
          className={classNames(
            "sm:flex sm:items-center sm:px-4 xl:flex-1 xl:justify-between",
            {
              hidden: !isOpen,
              block: isOpen
            }
          )}
        >
          {!loading ? (
            <div className="hidden xl:block xl:relative xl:max-w-xs xl:w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-6 w-6 fill-current text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.32 14.9l1.1 1.1c.4-.02.83.13 1.14.44l3 3a1.5 1.5 0 0 1-2.12 2.12l-3-3a1.5 1.5 0 0 1-.44-1.14l-1.1-1.1a8 8 0 1 1 1.41-1.41l.01-.01zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                </svg>
              </div>
              <input
                value={searchTerm}
                onChange={onSearchByName}
                className="block w-full border border-transparent bg-gray-200 focus:outline-none focus:bg-white focus:border-gray-300 text-gray-900 rounded-lg pl-10 pr-4 py-2"
                placeholder="Search by mission name"
              />
            </div>
          ) : null}
        </nav>
      </header>
    </div>
  );
}

interface SearchFiltersProps {
  to: number;
  from: number;
  nationality: string;
  status: string;
  loading: boolean;
  filters: Filters;
  rockets: string[];
  payloads: string[];
  searchTerm: string;
  onSelectStatus: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectToYear: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSelectFromYear: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSelectNationality: (e: ChangeEvent<HTMLSelectElement>) => void;
  onCheckboxRocket: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheckboxPayload: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchByName: (e: ChangeEvent<HTMLInputElement>) => void;
}

function SearchFilters({
  nationality,
  filters,
  from,
  to,
  loading,
  status,
  rockets,
  payloads,
  searchTerm,
  onSelectStatus,
  onSelectToYear,
  onSelectFromYear,
  onCheckboxRocket,
  onCheckboxPayload,
  onSelectNationality,
  onSearchByName
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  function onToggle() {
    setIsOpen(!isOpen);
  }

  if (loading) {
    return <section className="bg-black xl:w-72" />;
  }

  return (
    <section className="bg-black xl:w-72">
      <div className="flex justify-between px-4 py-3 xl:hidden">
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-6 w-6 fill-current text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.32 14.9l1.1 1.1c.4-.02.83.13 1.14.44l3 3a1.5 1.5 0 0 1-2.12 2.12l-3-3a1.5 1.5 0 0 1-.44-1.14l-1.1-1.1a8 8 0 1 1 1.41-1.41l.01-.01zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
            </svg>
          </div>
          <input
            onChange={onSearchByName}
            value={searchTerm}
            className="block w-full bg-gray-900 focus:outline-none focus:bg-white focus:text-gray-900 text-white rounded-lg pl-10 pr-4 py-2"
            placeholder="Search by mission name"
          />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={classNames(
            "ml-4 inline-flex items-center hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow pl-3 pr-4",
            {
              "bg-gray-600": isOpen,
              "bg-gray-700": !isOpen
            }
          )}
        >
          <svg
            className="h-6 w-6 fill-current text-gray-500"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm3 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm4 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4z" />
          </svg>
          <span className="ml-1 text-white font-medium">Filters</span>
        </button>
      </div>
      <form
        className={classNames(
          {
            hidden: !isOpen,
            block: isOpen
          },
          "xl:block xl:h-full xl:flex xl:flex-col xl:justify-between"
        )}
      >
        <div className="lg:flex xl:block xl:overflow-y-auto">
          <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 xl:border-t-0 xl:w-full">
            <div className="flex flex-wrap -mx-2">
              <label className="block w-1/2 px-2 sm:w-1/4 lg:w-1/2">
                <span className="text-sm font-semibold text-gray-500">
                  From
                </span>
                <select
                  value={from}
                  onChange={onSelectFromYear}
                  className="mt-1 form-select block w-full text-white shadow focus:bg-gray-600"
                >
                  {filters.years.map((year: number) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </label>
              <label className="block w-1/2 px-2 sm:w-1/4 lg:w-1/2">
                <span className="text-sm font-semibold text-gray-500">To</span>
                <select
                  value={to}
                  onChange={onSelectToYear}
                  className="mt-1 form-select block w-full text-white shadow focus:bg-gray-600"
                >
                  {pipe<number[], number[], ReactElement[]>(
                    filter((year: number) => year >= from),
                    map((year: number) => <option key={year}>{year}</option>)
                  )(filters.years)}
                </select>
              </label>
              <label className="mt-4 block w-full px-2 sm:mt-0 sm:w-1/2 lg:mt-4 lg:w-full">
                <span className="text-sm font-semibold text-gray-500">
                  Nationality
                </span>
                <select
                  value={nationality}
                  onChange={onSelectNationality}
                  className="mt-1 form-select block w-full text-white shadow focus:bg-gray-600"
                >
                  <option value={"ALL"}>All</option>
                  {filters.payloadNationalities.map((nationality: string) => (
                    <option key={nationality}>{nationality}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 lg:border-l xl:w-full">
            <span className="block text-sm font-semibold text-gray-500">
              Launch Success
            </span>
            <div className="sm:flex sm:-mx-2 lg:block lg:mx-0">
              <label className="mt-3 sm:w-1/4 sm:px-2 flex items-center lg:w-full lg:px-0">
                <input
                  onChange={onSelectStatus}
                  className="form-radio bg-gray-900 focus:bg-gray-700"
                  type="radio"
                  name="propertyType"
                  value={"ALL"}
                  checked={status === "ALL"}
                />
                <span className="ml-2 text-white">All</span>
              </label>
              <label className="mt-3 sm:w-1/4 sm:px-2 flex items-center lg:w-full lg:px-0">
                <input
                  onChange={onSelectStatus}
                  className="form-radio bg-gray-900 focus:bg-gray-700"
                  type="radio"
                  name="propertyType"
                  value={"SUCCESS"}
                  checked={status === "SUCCESS"}
                />
                <span className="ml-2 text-white">Success</span>
              </label>
              <label className="mt-3 sm:w-1/4 sm:px-2 flex items-center lg:w-full lg:px-0">
                <input
                  onChange={onSelectStatus}
                  className="form-radio bg-gray-900 focus:bg-gray-700"
                  type="radio"
                  name="propertyType"
                  value="FAILED"
                  checked={status === "FAILED"}
                />
                <span className="ml-2 text-white">Failed</span>
              </label>
              <label className="mt-3 sm:w-1/4 sm:px-2 flex items-center lg:w-full lg:px-0">
                <input
                  onChange={onSelectStatus}
                  className="form-radio bg-gray-900 focus:bg-gray-700"
                  type="radio"
                  name="propertyType"
                  value="SCHEDULED"
                  checked={status === "SCHEDULED"}
                />
                <span className="ml-2 text-white">Scheduled</span>
              </label>
            </div>
          </div>
          <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 lg:border-l xl:w-full">
            <span className="block text-sm font-semibold text-gray-500">
              Rocket
            </span>
            <div className="sm:flex sm:-mx-2 sm:flex-wrap">
              {filters.rockets.map((rocket: string) => (
                <label
                  key={rocket}
                  className="mt-3 flex items-center sm:w-1/4 sm:px-2 lg:w-1/2 xl:w-full"
                >
                  <input
                    className="form-checkbox bg-gray-900 focus:bg-gray-700"
                    type="checkbox"
                    name="balcony"
                    value={rocket}
                    onChange={onCheckboxRocket}
                    checked={includes(rocket, rockets)}
                  />
                  <span className="ml-2 text-white">{rocket}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 border-t border-gray-900 lg:w-1/3 lg:border-l xl:w-full">
            <span className="block text-sm font-semibold text-gray-500">
              Payload Type
            </span>
            <div className="sm:flex sm:-mx-2 sm:flex-wrap">
              {filters.payloadTypes.map((payloadType: string) => (
                <label
                  key={payloadType}
                  className="mt-3 flex items-center sm:w-1/4 sm:px-2 lg:w-1/2 xl:w-full"
                >
                  <input
                    className="form-checkbox bg-gray-900 focus:bg-gray-700"
                    type="checkbox"
                    name="balcony"
                    value={payloadType}
                    onChange={onCheckboxPayload}
                    checked={includes(payloadType, payloads)}
                  />
                  <span className="ml-2 text-white">{payloadType}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

interface LaunchCardProps {
  launch: Launch;
}

function LaunchCard({ launch }: LaunchCardProps) {
  return (
    <div>
      <div className="relative pb-5/6">
        <div className="absolute inset-0">
          <FastImageImage
            classNameMedia="rounded-lg shadow-md object-cove"
            src={launch.img}
          />
        </div>
      </div>
      <div className="relative px-4 -mt-16">
        <div className="bg-white rounded-lg px-4 py-4 shadow-lg">
          <div className="flex items-baseline">
            <span
              className={classNames(
                {
                  "bg-teal-200 text-teal-800 ": launch.success,
                  "bg-red-200 text-red-800":
                    not(isNil(launch.success)) && !launch.success,
                  "bg-blue-200 text-blue-800": isNil(launch.success)
                },
                "inline-block px-2 py-1 leading-none rounded-full font-semibold uppercase tracking-wide text-xs"
              )}
            >
              {launch.success === null
                ? "SCHEDULED"
                : !launch.success
                ? "FAILED"
                : launch.success
                ? "SUCCESS"
                : null}
            </span>
            <div className="ml-2 text-xs text-gray-600 font-semibold uppercase tracking-wide">
              {launch.nationality} &bull; {launch.year}
            </div>
          </div>
          <h4 className="mt-1 text-gray-900 font-semibold text-lg">
            {launch.name}
          </h4>
          <div className="mt-1">
            <span className="text-gray-900">{launch.rocket}</span>
            <span className="ml-1 text-sm text-gray-600">rocket</span>
          </div>
          <div className="mt-1">
            <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
              {compose(
                uniq,
                map((item: string) => (
                  <span key={item} className="ml-1 text-sm text-gray-600">
                    &bull; {item}{" "}
                  </span>
                ))
              )(launch.payloadType)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Constants
const GAP_SIZE = 20;
const CARD_HEIGHT = 350;
const CARD_WIDTH = 300;

//State
interface AppState {
  searchTerm: string;
  loading: boolean;
  launches: Launch[];
  to: number;
  from: number;
  nationality: string;
  status: string;
  rockets: string[];
  payloads: string[];
}

const initialState: AppState = {
  searchTerm: "",
  loading: false,
  launches: [],
  to: 0,
  from: 0,
  nationality: "ALL",
  status: "ALL",
  rockets: [],
  payloads: []
};

type Action =
  | { type: "FETCH_LAUNCHES" }
  | {
      type: "FETCH_LAUNCHES_SUCCESS";
      launches: Launch[];
      from: number;
      to: number;
    }
  | { type: "SELECT_TO_YEAR"; year: number }
  | { type: "SELECT_FROM_YEAR"; year: number }
  | { type: "SELECT_NATIONALITY"; nationality: string }
  | { type: "CHECK_ROCKET"; rocket: string }
  | { type: "UNCHECK_ROCKET"; rocket: string }
  | { type: "CHECK_PAYLOAD_TYPE"; payloadType: string }
  | { type: "UNCHECK_PAYLOAD_TYPE"; payloadType: string }
  | { type: "SELECT_STATUS"; status: string }
  | { type: "SEARCH_BY_NAME"; searchTerm: string };

const AppReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "FETCH_LAUNCHES":
      return assoc("loading", true, state);

    case "FETCH_LAUNCHES_SUCCESS": {
      const { launches, from, to } = action;
      return evolve(
        {
          launches: always(launches),
          from: always(from),
          to: always(to),
          loading: always(false)
        },
        state
      );
    }

    case "SELECT_FROM_YEAR": {
      if (action.year > state.to) {
        return evolve(
          {
            from: always(action.year),
            to: always(action.year)
          },
          state
        );
      } else {
        return assoc("from", action.year, state);
      }
    }

    case "SELECT_TO_YEAR":
      return assoc("to", action.year, state);

    case "SELECT_NATIONALITY":
      return assoc("nationality", action.nationality, state);

    case "CHECK_ROCKET":
      return assoc("rockets", append(action.rocket, state.rockets), state);

    case "UNCHECK_ROCKET":
      return assoc(
        "rockets",
        filter(r => r !== action.rocket, state.rockets),
        state
      );

    case "CHECK_PAYLOAD_TYPE":
      return assoc(
        "payloads",
        append(action.payloadType, state.payloads),
        state
      );

    case "UNCHECK_PAYLOAD_TYPE":
      return assoc(
        "payloads",
        filter(p => p !== action.payloadType, state.payloads),
        state
      );

    case "SELECT_STATUS":
      return assoc("status", action.status, state);

    case "SEARCH_BY_NAME":
      return assoc("searchTerm", action.searchTerm, state);

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const {
    launches,
    to,
    from,
    nationality,
    status,
    rockets,
    payloads,
    searchTerm,
    loading
  } = state;

  function adaptLaunch(item: any): Launch {
    return {
      id: item.flight_number,
      name: item.mission_name,
      year: item.launch_year,
      rocket: item.rocket.rocket_name,
      nationality: item.rocket.second_stage.payloads[0].nationality,
      img:
        item.links.flickr_images.length > 0
          ? item.links.flickr_images[0]
          : "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
      payloadType: item.rocket.second_stage.payloads.map(
        (item: any) => item.payload_type
      ),
      success: item.launch_success
    };
  }

  useEffect(() => {
    async function fetchLaunches() {
      dispatch({ type: "FETCH_LAUNCHES" });
      const response = await fetch("https://api.spacexdata.com/v3/launches");
      const json = await response.json();
      const launches = await json.map((item: any) => adaptLaunch(item));

      interface YearsToFrom {
        to: number;
        from: number;
      }

      const getToFrom = (acc: YearsToFrom, { year }: Launch) =>
        evolve<Evolver<{ to: number; from: number }>, YearsToFrom>(
          {
            to: max(year),
            from: acc.from === 0 ? always(year) : min(year)
          },
          acc
        );

      const years = reduce(getToFrom, { to: 0, from: 0 }, launches);

      dispatch({
        type: "FETCH_LAUNCHES_SUCCESS",
        launches,
        from: years.from,
        to: years.to
      });
    }

    fetchLaunches();
  }, []);

  const visibleLaunches: Launch[] = useMemo(() => {
    const reverseIncludes = flip(includes);

    return filter(
      where({
        name: pipe(toLower, includes(toLower(searchTerm))),
        year: both(gte(to), lte(from)),
        nationality: nationality === "ALL" ? always(true) : equals(nationality),
        rocket: rockets.length === 0 ? always(true) : reverseIncludes(rockets),
        payloadType:
          payloads.length === 0 ? always(true) : any(reverseIncludes(payloads)),
        success:
          status === "ALL"
            ? always(true)
            : status === "SUCCESS"
            ? equals(true)
            : status === "FAILED"
            ? equals(false)
            : status === "SCHEDULED"
            ? isNil
            : null
      }),
      launches
    );
  }, [to, from, launches, nationality, status, rockets, payloads, searchTerm]);

  const filters = useMemo(() => {
    return reduce(
      (acc: Filters, { year, payloadType, nationality, rocket }: Launch) =>
        evolve(
          {
            years: compose<number[], number[], number[]>(uniq, append(year)),
            rockets: compose<string[], string[], string[]>(
              uniq,
              append(rocket)
            ),
            payloadTypes: compose(uniq, concat(payloadType)),
            payloadNationalities: compose<string[], string[], string[]>(
              uniq,
              append(nationality)
            )
          },
          acc
        ),
      {
        years: [],
        payloadTypes: [],
        payloadNationalities: [],
        rockets: []
      },
      launches
    );
  }, [launches]);

  const Item = ({ data, index, style }: any) => {
    const { cardHeight, cardWidth, columnCount, gapSize, itemCount } = data;

    // This is the range of cards visible on this row, given the current width:
    const startIndex = index * columnCount;
    const stopIndex = Math.min(itemCount - 1, startIndex + columnCount - 1);

    const cards = [];
    for (let i = startIndex; i <= stopIndex; i++) {
      cards.push(
        <div
          key={i}
          style={{
            flex: `0 0 ${cardWidth}px`,
            height: cardHeight,
            margin: `0 ${gapSize / 2}px`
          }}
        >
          <LaunchCard launch={visibleLaunches[i]} />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center" style={style}>
        {cards}
      </div>
    );
  };

  function ListWrapper({ height, itemCount, width }: any) {
    // How many cards can we show per row, given the current width?
    const columnCount = Math.floor(
      (width - GAP_SIZE) / (CARD_WIDTH + GAP_SIZE)
    );
    const rowCount = Math.ceil(itemCount / columnCount);

    const itemData = useMemo(
      () => ({
        columnCount,
        itemCount,
        visibleLaunches,

        // These values could be dynamically calculated as well
        cardWidth: CARD_WIDTH,
        cardHeight: CARD_HEIGHT,
        gapSize: GAP_SIZE
      }),
      [columnCount, itemCount]
    );

    return (
      <List
        height={height}
        itemCount={rowCount}
        itemSize={CARD_HEIGHT + GAP_SIZE}
        width={width}
        itemData={itemData}
      >
        {Item}
      </List>
    );
  }

  function handleSelectToYear(e: ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: "SELECT_TO_YEAR", year: +e.target.value });
  }

  function handleSelectFromYear(e: ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: "SELECT_FROM_YEAR", year: +e.target.value });
  }

  function handleSelectNationality(e: ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: "SELECT_NATIONALITY", nationality: e.target.value });
  }

  function handleSelectStatus(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "SELECT_STATUS", status: e.target.value });
  }

  function handleCheckboxRocket(e: ChangeEvent<HTMLInputElement>) {
    if (includes(e.target.value, rockets)) {
      dispatch({ type: "UNCHECK_ROCKET", rocket: e.target.value });
    } else {
      dispatch({ type: "CHECK_ROCKET", rocket: e.target.value });
    }
  }

  function handleCheckboxPayload(e: ChangeEvent<HTMLInputElement>) {
    if (includes(e.target.value, payloads)) {
      dispatch({ type: "UNCHECK_PAYLOAD_TYPE", payloadType: e.target.value });
    } else {
      dispatch({ type: "CHECK_PAYLOAD_TYPE", payloadType: e.target.value });
    }
  }

  function handleSearchByName(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "SEARCH_BY_NAME", searchTerm: e.target.value });
  }

  return (
    <div className="min-h-screen bg-gray-200 antialiased xl:flex xl:flex-col xl:h-screen">
      <SiteHeader
        onSearchByName={handleSearchByName}
        searchTerm={searchTerm}
        loading={loading}
      />
      <div className="xl:flex-1 xl:flex xl:overflow-y-hidden">
        <SearchFilters
          filters={filters}
          to={to}
          from={from}
          status={status}
          nationality={nationality}
          rockets={rockets}
          searchTerm={searchTerm}
          payloads={payloads}
          loading={loading}
          onSearchByName={handleSearchByName}
          onSelectStatus={handleSelectStatus}
          onSelectToYear={handleSelectToYear}
          onSelectFromYear={handleSelectFromYear}
          onCheckboxRocket={handleCheckboxRocket}
          onCheckboxPayload={handleCheckboxPayload}
          onSelectNationality={handleSelectNationality}
        />
        <main className="py-6 xl:flex-1 xl:overflow-x-hidden">
          <div className="h-screen">
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <Spinner name="line-scale" fadeIn={"none"} />
              </div>
            ) : (
              <AutoSizer>
                {({ height, width }) => (
                  <ListWrapper
                    height={height}
                    itemCount={visibleLaunches.length}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
