package hello.springmvc.service;

import hello.springmvc.domain.Board;
import hello.springmvc.domain.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;

    @Transactional
    public Board saveBoard(Board board){
        return boardRepository.save(board);
    }

    @Transactional(readOnly=true)
    public Board findBoard(int id){
        return boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("id를 확인해주세요."));
    }

    @Transactional(readOnly = true)
    public List<Board> findAllBoard(){
        List<Board> result = boardRepository.findAll();

        System.out.println(result.size());

        return result;
    }

    @Transactional
    public Board editBoard(int id, Board board){
        Board boardEntity = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("id를 확인해주세요."));
        boardEntity.setTitle(board.getTitle());
        boardEntity.setContent(board.getContent());
        boardEntity.setWriter(board.getWriter());

        return boardEntity;
    }

    public String deleteBoard(int id){
        boardRepository.deleteById(id);
        return "delete OK";
    }

}
