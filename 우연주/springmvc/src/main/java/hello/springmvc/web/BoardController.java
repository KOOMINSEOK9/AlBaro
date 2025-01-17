package hello.springmvc.web;

import hello.springmvc.domain.Board;
import hello.springmvc.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {

    private final BoardService boardService;

    @CrossOrigin
    @PostMapping("/board")
    public ResponseEntity<?> save(@RequestBody Board board){
        return new ResponseEntity<>(boardService.saveBoard(board), HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping("/board")
    public ResponseEntity<?> findAll(){
        System.out.println("findALl");
        return new ResponseEntity<>(boardService.findAllBoard(), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/board/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") int id){
        return new ResponseEntity<>(boardService.findBoard(id), HttpStatus.OK);
    }

    @CrossOrigin
    @PutMapping("/board/{id}")
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody Board board){
        return new ResponseEntity<>(boardService.editBoard(id, board), HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/board/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") int id){
        return new ResponseEntity<>(boardService.deleteBoard(id), HttpStatus.OK);
    }

}
