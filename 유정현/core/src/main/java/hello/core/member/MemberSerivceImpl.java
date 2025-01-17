package hello.core.member;

public class MemberSerivceImpl implements MemberService{

//    private final MemberRepository memberRepository = new MemoryMemberRepository();
    // 구체화와 추상화에 모두 의존하고 있음 -> DIP 위반 --> 밑의 코드로 변경
    private final MemberRepository memberRepository;

    public MemberSerivceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    } //구현체가 어떤 것이 들어갈 지를 생성자를 통해서 결정한다. --> 결국 이제 추상화에만 의존하게 된다!(생성자 주입)

    @Override
    public void join(Member member) {
            memberRepository.save(member);
    }

    @Override
    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId);
    }
}
