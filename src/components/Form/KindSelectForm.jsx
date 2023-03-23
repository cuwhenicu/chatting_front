import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Text,
  Select,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RoomKindsToFront, SellKindsToFront } from "../../services/data";
import { HouseRegisterValues } from "../../services/data";

const KindSelectForm = ({
  setUpdatedHouse,
  setUpdatedData,
  setSellKind,
  sellKind,
  roomKind,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isModify, setIsModify] = useState(false);

  const roomKindOptions = [
    "ONE_ROOM",
    "HOME",
    "APART",
    "VILLA",
    "OFFICETEL",
    "SHARE_HOUSE",
  ].map((roomKind) => ({ value: roomKind, label: RoomKindsToFront[roomKind] }));

  const sellKindOptions = ["SALE", "CHARTER", "MONTHLY_RENT"].map(
    (sellKind) => ({
      value: sellKind,
      label: SellKindsToFront[sellKind],
    })
  );

  const onEnter = (data) => {
    let nextHouse = {};
    let nextData = {};
    let isChange = false;
    setUpdatedHouse((prevHouse) => {
      HouseRegisterValues.forEach((item) => {
        if (data[item.eng]) {
          if (data[item.eng] !== prevHouse[item.eng]) {
            nextHouse[item.eng] = data[item.eng];
            isChange = true;
          } else {
            nextHouse[item.eng] = prevHouse[item.eng];
          }
        } else {
          nextHouse[item.eng] = prevHouse[item.eng];
        }
      });
      return nextHouse;
    });

    setUpdatedData((prevData) => {
      HouseRegisterValues.forEach((item) => {
        if (data[item.eng]) {
          nextData[item.eng] = data[item.eng];
        } else if (prevData[item.eng]) {
          nextData[item.eng] = prevData[item.eng];
        }
      });
      return nextData;
    });

    if (isChange) {
      setIsModify(false);
    }
  };

  const handleSellKindSelectChange = (event) => {
    const selectedSellKindVal = event.currentTarget.value;
    setSellKind(selectedSellKindVal);
  };

  const onModify = () => {
    setIsModify(!isModify);
  };

  return (
    <>
      <FormLabel marginBottom="0" fontWeight="600" w="100%" my="2">
        방 종류 / 거래 종류
      </FormLabel>
      {isModify ? (
        <form onSubmit={handleSubmit(onEnter)}>
          <HStack w="40vw" alignItems="center">
            <FormControl
              isInvalid={errors.room_kind}
              id="room_kind"
              my="1"
              w="40vw"
            >
              <Select
                {...register("room_kind", { required: true })}
                placeholder="방 종류를 선택해주세요"
                fontSize="14px"
              >
                {roomKindOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{`방 종류를 선택해주세요`}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.sell_kind}
              id="sell_kind"
              my="1"
              w="40vw"
            >
              <HStack>
                <Select
                  {...register("sell_kind", { required: true })}
                  placeholder="거래 종류를 선택해주세요"
                  fontSize="14px"
                  onChange={handleSellKindSelectChange}
                >
                  {sellKindOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Button type="submit">입력</Button>
                <Button onClick={onModify}>취소</Button>
              </HStack>
              <FormErrorMessage>{`거래 종류를 선택해주세요`}</FormErrorMessage>
            </FormControl>
          </HStack>
        </form>
      ) : (
        <HStack justifyContent="space-between" w="100%" my="4" h="5.3vh">
          <VStack justifyContent="flex-start" w="100%">
            <HStack w="100%">
              <Text>{roomKind ? RoomKindsToFront[roomKind] : ""}</Text>
              <Text>{sellKind ? SellKindsToFront[sellKind] : ""}</Text>
            </HStack>{" "}
          </VStack>
          <Button onClick={onModify}>수정</Button>
        </HStack>
      )}
    </>
  );
};

export default KindSelectForm;
