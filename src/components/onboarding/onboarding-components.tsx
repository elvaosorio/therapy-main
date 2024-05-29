import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FaFemale, FaGenderless, FaMale } from "react-icons/fa";
import { PiGenderNonbinaryBold } from "react-icons/pi";

interface OnboardingComponentProps {
    setData: Dispatch<SetStateAction<string[]>>;
    index: number;
    handleContinue: () => void;
}

export const OnboardingName = ({
    setData,
    index,
    handleContinue,
}: OnboardingComponentProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = e.target.value;
            return newData;
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleContinue();
        }
    };

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input
                type="text"
                id="name"
                placeholder="name"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

const GENDERS = [
    {
        gender: "Female",
        icon: FaFemale,
        value: "female",
    },
    {
        gender: "Male",
        icon: FaMale,
        value: "male",
    },
    {
        gender: "Non-binary",
        icon: PiGenderNonbinaryBold,
        value: "nb",
    },
    {
        gender: "Other",
        icon: FaGenderless,
        value: "other",
    },
];

export const OnboardingGender = ({
    setData,
    index,
}: OnboardingComponentProps) => {
    const handleChange = (value: string) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = value;
            return newData;
        });
    };

    return (
        <ToggleGroup
            type="single"
            className="flex flex-col w-full"
            onValueChange={handleChange}
        >
            {GENDERS.map((item) => (
                <ToggleGroupItem
                    value={item.value}
                    className="w-full text-left flex justify-start py-6"
                    variant={"outline"}
                    key={item.gender}
                >
                    <div className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4" />
                        <p>{item.gender}</p>
                    </div>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};

const AGE_RANGES = [
    { value: "18-24" },
    { value: "25-34" },
    { value: "35-44" },
    { value: "45-54" },
    { value: "55-64" },
    { value: "65+" },
];

export const OnboardingAge = ({ setData, index }: OnboardingComponentProps) => {
    const handleChange = (value: string) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = value;
            return newData;
        });
    };

    return (
        <ToggleGroup
            type="single"
            className="flex flex-col w-full"
            onValueChange={handleChange}
        >
            {AGE_RANGES.map((item) => (
                <ToggleGroupItem
                    value={item.value}
                    className="w-full text-left flex justify-start py-6"
                    variant={"outline"}
                    key={item.value}
                >
                    <div className="flex items-center space-x-2">
                        <p>{item.value}</p>
                    </div>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};

const COUNTRIES = [
    {
        country: "Venezuela",
        img: "",
    },
    {
        country: "Spain",
        img: "",
    },
    {
        country: "Mexico",
        img: "",
    },
    {
        country: "America",
        img: "",
    },
];

export const OnboardingCountry = ({
    setData,
    index,
}: OnboardingComponentProps) => {
    const handleChange = (value: string) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = value;
            return newData;
        });
    };

    return (
        <ToggleGroup type="single" onValueChange={handleChange}>
            <div className="grid grid-cols-3 w-full max-w-sm items-center gap-x-2 gap-y-3">
                {COUNTRIES.map((item) => (
                    <ToggleGroupItem
                        className="border rounded-md p-2 flex flex-col w-full h-full aspect-square"
                        key={item.country}
                        value={item.country}
                    >
                        <img
                            src={item.img.length > 0 ? item.img : "/usa.webp"}
                            className="w-full aspect-square object-contain"
                        />
                        <p className="text-center overflow-ellipsis overflow-hidden">
                            {item.country}
                        </p>
                    </ToggleGroupItem>
                ))}
            </div>
        </ToggleGroup>
    );
};

export const OnboardingLanguage = ({
    setData,
    index,
}: OnboardingComponentProps) => {
    const handleChange = (value: string) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = value;
            return newData;
        });
    };

    return (
        <Select onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

const PREFERRED_LANGUAGES = [{ value: "English" }, { value: "Spanish" }];

export const OnboardingLanguageToggleGroup = ({
    setData,
    index,
}: OnboardingComponentProps) => {
    const handleChange = (value: string) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = value;
            return newData;
        });
    };

    return (
        <ToggleGroup
            type="single"
            className="flex flex-col w-full"
            onValueChange={handleChange}
        >
            {PREFERRED_LANGUAGES.map((item) => (
                <ToggleGroupItem
                    value={item.value}
                    className="w-full text-left flex justify-start py-6"
                    variant={"outline"}
                    key={item.value}
                >
                    <div className="flex items-center space-x-2">
                        <p>{item.value}</p>
                    </div>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};

export const OnboardingBio = ({ setData, index }: OnboardingComponentProps) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = e.target.value;
            return newData;
        });
    };
    return (
        <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your bio</Label>
            <Textarea
                placeholder="Type your message here..."
                id="message"
                onChange={handleChange}
            />
        </div>
    );
};
