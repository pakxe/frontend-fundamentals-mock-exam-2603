// @ts-nocheck

export function b() {
  return (
    <>
      <Header leftSlot={'<- 예약 현황으로'}></Header>

      <section>
        <Text>예약 조건</Text>

        <label>
          날짜
          <SelectDate />
        </label>

        <Grid col={2}>
          <label>
            시작 시간
            <Select />
          </label>

          <label>
            종료 시간
            <Select />
          </label>
        </Grid>

        <Grid col={2}>
          <label>
            참석 인원
            <SelectNumber />
          </label>

          <label>
            선호 층
            <Select />
          </label>
        </Grid>

        <Text>필요 장비</Text>
        <Flex wrap>
          {equipments.map(equipment => (
            <Chip onClick={} isSelected={}>
              {name}
            </Chip>
          ))}
        </Flex>
      </section>
    </>
  );
}
