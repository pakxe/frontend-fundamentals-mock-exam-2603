// @ts-nocheck

export function a() {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Title>회의실 예약</Title>

      <section>
        <label>
          날짜 선택
          <SelectDate />
        </label>
      </section>

      <section>
        <Text>예약 현황</Text>

        <ErrorBoundary>
          <Suspense>
            <RoomTimeline />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section>
        <Text>예약 목록</Text>
        <Text>{myReservations.length}개</Text>
        {myReservations.map(r => (
          <Card title={} description={} rightSlot={<Button>취소</Button>} />
        ))}
      </section>

      <section>
        <Button>예약하기</Button>
      </section>
    </>
  );
}
