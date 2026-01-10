<script lang="ts">
	import { onMount } from 'svelte';
	
	type GameState = 'menu' | 'difficulty' | 'customize' | 'playing' | 'gameover';
	
	let gameState = $state<GameState>('menu');
	let difficulty = $state('medium');
	let chess: any = null;
	let boardSquares = $state<{square: string, piece: any}[]>([]);
	let selectedSquare = $state<string | null>(null);
	let legalMoves = $state<string[]>([]);
	let isPlayerTurn = $state(true);
	let isThinking = $state(false);
	let gameStatus = $state('');
	let moveHistory = $state<{white: string, black: string}[]>([]);
	let rawMoves = $state<string[]>([]);
	let lastMove = $state<{from: string, to: string} | null>(null);
	let capturedByPlayer = $state<string[]>([]);
	let capturedByAI = $state<string[]>([]);
	let chessReady = $state(false);
	let playerColor = $state<'w' | 'b'>('w');
	let showPromotion = $state(false);
	let promotionSquare = $state<{from: string, to: string} | null>(null);
	let darkTheme = $state(true);
	let showRules = $state(false);
	
	let selectedDifficulty = $state<{id: string, name: string, desc: string, icon: string} | null>(null);
	let pieceStyle = $state(0);
	let boardStyle = $state(0);
	let timeControl = $state<number | null>(null);
	let playerTime = $state(0);
	let aiTime = $state(0);
	let timerInterval: any = null;
	
	const difficulties = [
		{ id: 'beginner', name: 'Beginner', desc: 'Perfect for learning. AI makes frequent mistakes.', icon: '🌱' },
		{ id: 'easy', name: 'Easy', desc: 'Casual play. AI plays defensively.', icon: '🎯' },
		{ id: 'medium', name: 'Medium', desc: 'Balanced challenge. Solid chess.', icon: '⚔️' },
		{ id: 'hard', name: 'Hard', desc: 'For experienced players. Aggressive AI.', icon: '🔥' },
	];
	
	const pieceStyles = [
		{ name: 'Classic', pieces: { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' } as Record<string, string> },
		{ name: 'Filled', pieces: { wK: '♚', wQ: '♛', wR: '♜', wB: '♝', wN: '♞', wP: '♟', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' } as Record<string, string> },
		{ name: 'Outlined', pieces: { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♔', bQ: '♕', bR: '♖', bB: '♗', bN: '♘', bP: '♙' } as Record<string, string> },
		{ name: 'Neo', pieces: { wK: '⛃', wQ: '⛁', wR: '▣', wB: '◆', wN: '▲', wP: '●', bK: '⛂', bQ: '⛀', bR: '▢', bB: '◇', bN: '△', bP: '○' } as Record<string, string> },
		{ name: 'Royal', pieces: { wK: '👑', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '🏴', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' } as Record<string, string> },
		{ name: 'Fancy', pieces: { wK: '♔', wQ: '♕', wR: '⚔', wB: '✦', wN: '♘', wP: '◉', bK: '♚', bQ: '♛', bR: '⚔', bB: '✧', bN: '♞', bP: '◎' } as Record<string, string> },
	];
	
	const boardStyles = [
		{ name: 'Classic', light: '#f0d9b5', dark: '#b58863' },
		{ name: 'Blue', light: '#dee3e6', dark: '#8ca2ad' },
		{ name: 'Green', light: '#ffffdd', dark: '#86a666' },
		{ name: 'Purple', light: '#e8d0ff', dark: '#9370db' },
	];
	
	const timeOptions = [
		{ label: 'Unlimited', value: null as number | null },
		{ label: '5 min', value: 300 },
		{ label: '10 min', value: 600 },
		{ label: '15 min', value: 900 },
		{ label: '30 min', value: 1800 },
	];
	
	const aiPersonality: Record<string, any> = {
		beginner: { blunderChance: 0.4, depth: 1, thinkTime: 1500 },
		easy: { blunderChance: 0.2, depth: 2, thinkTime: 1000 },
		medium: { blunderChance: 0.08, depth: 3, thinkTime: 600 },
		hard: { blunderChance: 0, depth: 4, thinkTime: 300 },
	};
	
	const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
	const pawnTable = [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0];
	const knightTable = [-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50];
	const bishopTable = [-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20];
	const rookTable = [0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0];
	const queenTable = [-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20];
	const kingTable = [-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20];

	function getPiece(color: string, type: string): string {
		const key = color + type.toUpperCase();
		return pieceStyles[pieceStyle].pieces[key] || '?';
	}

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js';
		script.onload = () => { chessReady = true; };
		document.head.appendChild(script);
		return () => { if (timerInterval) clearInterval(timerInterval); };
	});

	function updateBoard() {
		if (!chess) return;
		const squares: {square: string, piece: any}[] = [];
		const files = ['a','b','c','d','e','f','g','h'];
		const ranks = playerColor === 'w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
		const fileOrder = playerColor === 'w' ? files : [...files].reverse();
		for (const rank of ranks) {
			for (const file of fileOrder) {
				const sq = file + rank;
				squares.push({ square: sq, piece: chess.get(sq) });
			}
		}
		boardSquares = squares;
		isPlayerTurn = chess.turn() === playerColor;
		updateStatus();
		updateMoveHistory();
	}
	
	function updateStatus() {
		if (!chess) return;
		if (chess.in_checkmate()) { gameStatus = chess.turn() === playerColor ? 'Checkmate! You lose.' : 'Checkmate! You win!'; gameState = 'gameover'; stopTimer(); }
		else if (chess.in_stalemate()) { gameStatus = 'Stalemate!'; gameState = 'gameover'; stopTimer(); }
		else if (chess.in_draw()) { gameStatus = 'Draw!'; gameState = 'gameover'; stopTimer(); }
		else if (chess.in_check()) { gameStatus = 'Check!'; }
		else { gameStatus = isPlayerTurn ? 'Your turn' : 'AI thinking...'; }
	}
	
	function updateMoveHistory() {
		if (!chess) return;
		const history = chess.history({ verbose: true });
		rawMoves = chess.history();
		const pairs: {white: string, black: string}[] = [];
		for (let i = 0; i < rawMoves.length; i += 2) pairs.push({ white: rawMoves[i] || '', black: rawMoves[i + 1] || '' });
		moveHistory = pairs;
		
		// Update captured pieces
		const byPlayer: string[] = [];
		const byAI: string[] = [];
		for (const move of history) {
			if (move.captured) {
				const capturedPiece = getPiece(move.color === 'w' ? 'b' : 'w', move.captured);
				if (move.color === playerColor) byPlayer.push(capturedPiece);
				else byAI.push(capturedPiece);
			}
		}
		capturedByPlayer = byPlayer;
		capturedByAI = byAI;
	}
	
	function selectDifficulty(d: typeof difficulties[0]) { selectedDifficulty = d; difficulty = d.id; gameState = 'difficulty'; }
	
	function startGame() {
		if (!chessReady) return;
		// @ts-ignore
		chess = new Chess();
		selectedSquare = null;
		legalMoves = [];
		moveHistory = [];
		rawMoves = [];
		lastMove = null;
		gameStatus = '';
		capturedByPlayer = [];
		capturedByAI = [];
		isThinking = false;
		
		if (timeControl) {
			playerTime = timeControl;
			aiTime = timeControl;
			startTimer();
		}
		
		gameState = 'playing';
		updateBoard();
		
		// If player chose black, AI moves first
		if (playerColor === 'b') {
			const thinkTime = aiPersonality[difficulty]?.thinkTime || 500;
			isThinking = true;
			gameStatus = 'AI thinking...';
			setTimeout(() => {
				if (gameState === 'playing') {
					makeAIMove();
				}
			}, thinkTime);
		}
	}
	
	function startTimer() {
		if (timerInterval) clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			if (gameState !== 'playing') return;
			if (isPlayerTurn) { playerTime = Math.max(0, playerTime - 1); if (playerTime === 0) { gameStatus = 'Time out!'; gameState = 'gameover'; stopTimer(); } }
			else { aiTime = Math.max(0, aiTime - 1); if (aiTime === 0) { gameStatus = 'AI timed out! You win!'; gameState = 'gameover'; stopTimer(); } }
		}, 1000);
	}
	
	function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
	function formatTimer(s: number): string { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`; }
	
	function handleSquareClick(square: string) {
		if (!chess || gameState !== 'playing') return;
		if (!isPlayerTurn || isThinking) return;
		
		const piece = chess.get(square);
		
		if (selectedSquare) {
			// If clicking on a legal move square, make the move
			if (legalMoves.includes(square)) {
				const movingPiece = chess.get(selectedSquare);
				// Check for pawn promotion
				if (movingPiece?.type === 'p' && ((playerColor === 'w' && square[1] === '8') || (playerColor === 'b' && square[1] === '1'))) {
					promotionSquare = { from: selectedSquare, to: square };
					showPromotion = true;
					return;
				}
				makeMove(selectedSquare, square);
			} 
			// If clicking on own piece, select it instead
			else if (piece && piece.color === playerColor) {
				selectSquare(square);
			} 
			// Otherwise deselect
			else {
				selectedSquare = null;
				legalMoves = [];
			}
		} else {
			// Select own piece
			if (piece && piece.color === playerColor) {
				selectSquare(square);
			}
		}
	}
	
	function selectSquare(sq: string) { selectedSquare = sq; legalMoves = chess.moves({ square: sq, verbose: true }).map((m: any) => m.to); }
	function makeMove(from: string, to: string, promo?: string) {
		const move = chess.move({ from, to, promotion: promo || 'q' });
		if (move) { 
			lastMove = { from, to }; 
			selectedSquare = null; 
			legalMoves = []; 
			updateBoard();
			
			// Schedule AI move if it's AI's turn and game is still playing
			if (gameState === 'playing' && chess.turn() !== playerColor && !chess.game_over()) {
				const thinkTime = aiPersonality[difficulty]?.thinkTime || 500;
				isThinking = true;
				gameStatus = 'AI thinking...';
				setTimeout(() => {
					if (gameState === 'playing') {
						makeAIMove();
					}
				}, thinkTime);
			}
		}
	}
	function handlePromotion(p: string) { if (promotionSquare) makeMove(promotionSquare.from, promotionSquare.to, p); showPromotion = false; promotionSquare = null; }

	function evaluateBoard(): number {
		if (!chess) return 0;
		if (chess.in_checkmate()) return chess.turn() === 'w' ? -999999 : 999999;
		if (chess.in_draw()) return 0;
		let score = 0;
		const board = chess.board();
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const piece = board[r][c]; if (!piece) continue;
				const val = pieceValues[piece.type] || 0;
				let pos = 0; const idx = piece.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;
				if (piece.type === 'p') pos = pawnTable[idx];
				else if (piece.type === 'n') pos = knightTable[idx];
				else if (piece.type === 'b') pos = bishopTable[idx];
				else if (piece.type === 'r') pos = rookTable[idx];
				else if (piece.type === 'q') pos = queenTable[idx];
				else if (piece.type === 'k') pos = kingTable[idx];
				score += piece.color === 'w' ? (val + pos) : -(val + pos);
			}
		}
		if (chess.in_check()) score += chess.turn() === 'w' ? -50 : 50;
		return score;
	}
	
	function minimax(depth: number, alpha: number, beta: number, max: boolean): number {
		if (!chess || depth === 0 || chess.game_over()) return evaluateBoard();
		const moves = chess.moves();
		if (max) { let m = -Infinity; for (const mv of moves) { chess.move(mv); m = Math.max(m, minimax(depth-1, alpha, beta, false)); chess.undo(); alpha = Math.max(alpha, m); if (beta <= alpha) break; } return m; }
		else { let m = Infinity; for (const mv of moves) { chess.move(mv); m = Math.min(m, minimax(depth-1, alpha, beta, true)); chess.undo(); beta = Math.min(beta, m); if (beta <= alpha) break; } return m; }
	}
	
	function makeAIMove() {
		if (!chess || gameState !== 'playing') return;
		if (chess.game_over()) { updateBoard(); return; }
		if (chess.turn() === playerColor) return;
		
		isThinking = true;
		gameStatus = 'AI thinking...';
		
		const p = aiPersonality[difficulty];
		const moves = chess.moves({ verbose: true });
		
		if (!moves.length) {
			isThinking = false;
			updateBoard();
			return;
		}
		
		let bestMove = moves[0];
		
		// Check for checkmate moves first
		for (const mv of moves) {
			chess.move(mv);
			if (chess.in_checkmate()) {
				chess.undo();
				bestMove = mv;
				break;
			}
			chess.undo();
		}
		
		// Blunder chance - make random move
		if (Math.random() < p.blunderChance) {
			bestMove = moves[Math.floor(Math.random() * moves.length)];
		} else {
			// Use minimax to find best move
			let bestScore = playerColor === 'w' ? Infinity : -Infinity;
			
			for (const mv of moves) {
				chess.move(mv);
				const score = minimax(p.depth - 1, -Infinity, Infinity, playerColor === 'b');
				chess.undo();
				
				if (playerColor === 'w' ? score < bestScore : score > bestScore) {
					bestScore = score;
					bestMove = mv;
				}
			}
		}
		
		// Execute the move
		const result = chess.move(bestMove);
		if (result) {
			lastMove = { from: result.from, to: result.to };
		}
		
		isThinking = false;
		updateBoard();
	}
	
	function newGame() { stopTimer(); gameState = 'menu'; chess = null; selectedDifficulty = null; }
	function getSquareClass(sq: string, pc: any): string {
		const f = sq.charCodeAt(0) - 97, rk = parseInt(sq[1]) - 1, light = (f + rk) % 2 === 1;
		let c = light ? 'light' : 'dark';
		if (selectedSquare === sq) c += ' selected';
		if (legalMoves.includes(sq)) c += pc ? ' capture' : ' legal';
		if (lastMove && (lastMove.from === sq || lastMove.to === sq)) c += ' last-move';
		if (chess?.in_check() && pc?.type === 'k' && pc?.color === chess.turn()) c += ' in-check';
		return c;
	}
</script>

<section class="chess-app" class:light={!darkTheme}>
	{#if showRules}
		<div class="rules-overlay" onclick={() => showRules = false}>
			<div class="rules-panel" onclick={(e) => e.stopPropagation()}>
				<div class="rules-header"><h2>♟️ Rules</h2><button class="close-btn" onclick={() => showRules = false}>✕</button></div>
				<div class="rules-content">
					<div class="rule-section"><h3>🎯 Objective</h3><p>Checkmate the opponent's King.</p></div>
					<div class="rule-section"><h3>♔ King</h3><div class="pd">♔ ♚</div><p>Moves 1 square any direction.</p></div>
					<div class="rule-section"><h3>♕ Queen</h3><div class="pd">♕ ♛</div><p>Moves any squares in any direction.</p></div>
					<div class="rule-section"><h3>♖ Rook</h3><div class="pd">♖ ♜</div><p>Moves horizontally or vertically.</p></div>
					<div class="rule-section"><h3>♗ Bishop</h3><div class="pd">♗ ♝</div><p>Moves diagonally.</p></div>
					<div class="rule-section"><h3>♘ Knight</h3><div class="pd">♘ ♞</div><p>L-shape move. Jumps pieces.</p></div>
					<div class="rule-section"><h3>♙ Pawn</h3><div class="pd">♙ ♟</div><p>Forward 1 (or 2 first). Captures diagonal.</p></div>
					<div class="rule-section"><h3>🏰 Special</h3><p>Castling, En Passant, Promotion</p></div>
				</div>
			</div>
		</div>
	{/if}
	<div class="chess-header app-window-drag-handle">
		<span class="chess-title">♟️ Chess</span>
		{#if gameState === 'playing'}<span class="status" class:check={gameStatus === 'Check!'} class:active={gameStatus === 'Your turn' || gameStatus === 'AI thinking...'} data-text={gameStatus}>{gameStatus}</span>{/if}
		<div class="header-actions">
			<button class="icon-btn" onclick={() => showRules = true}><span class="btn-icon rules-icon">i</span></button>
			<button class="icon-btn" onclick={() => darkTheme = !darkTheme}><span class="btn-icon theme-icon">{darkTheme ? '☀' : '☾'}</span></button>
		</div>
	</div>
	{#if !chessReady}
		<div class="loading"><div class="spinner"></div><span>Loading...</span></div>
	{:else if gameState === 'menu'}
		<div class="menu">
			<div class="floating-pieces">
				<span class="float-piece" style="--x:10%;--y:20%;--delay:0s">♔</span>
				<span class="float-piece" style="--x:85%;--y:15%;--delay:1s">♛</span>
				<span class="float-piece" style="--x:15%;--y:70%;--delay:2s">♞</span>
				<span class="float-piece" style="--x:80%;--y:75%;--delay:0.5s">♜</span>
				<span class="float-piece" style="--x:50%;--y:85%;--delay:1.5s">♝</span>
			</div>
			<div class="menu-content">
				<div class="logo-big">♟️</div>
				<h1 class="title-big">Chess</h1>
				<p class="subtitle-big">Challenge Prasidh's AI</p>
				<div class="warning-box">
					<span class="warn-icon">⚠️</span>
					<div class="warn-text">
						<strong>Basic Engine</strong>
						<span>This is a simple chess AI for fun. For serious play, try Chess.com or Lichess.</span>
					</div>
				</div>
				<div class="section-label">Select Difficulty</div>
				<div class="diff-grid-2x2">
					<button class="diff-card beginner" onclick={() => selectDifficulty(difficulties[0])}>
						<span class="card-icon"><span class="icon-circle green">♙</span></span>
						<span class="card-name">Beginner</span>
						<span class="card-desc">Learning mode</span>
					</button>
					<button class="diff-card easy" onclick={() => selectDifficulty(difficulties[1])}>
						<span class="card-icon"><span class="icon-circle blue">♘</span></span>
						<span class="card-name">Easy</span>
						<span class="card-desc">Casual play</span>
					</button>
					<button class="diff-card medium" onclick={() => selectDifficulty(difficulties[2])}>
						<span class="card-icon"><span class="icon-circle orange">♗</span></span>
						<span class="card-name">Medium</span>
						<span class="card-desc">Balanced</span>
					</button>
					<button class="diff-card hard" onclick={() => selectDifficulty(difficulties[3])}>
						<span class="card-icon"><span class="icon-circle red">♛</span></span>
						<span class="card-name">Hard</span>
						<span class="card-desc">Expert level</span>
					</button>
				</div>
				<div class="external-links">
					<a href="https://www.chess.com/learn-how-to-play-chess" target="_blank" class="ext-link">📚 Learn Chess</a>
					<a href="https://www.chess.com/puzzles" target="_blank" class="ext-link">🧩 Puzzles</a>
					<a href="https://lichess.org" target="_blank" class="ext-link">🏆 Play Online</a>
					<a href="https://www.chess.com/openings" target="_blank" class="ext-link">📖 Openings</a>
				</div>
			</div>
		</div>
	{:else if gameState === 'difficulty'}
		<div class="diff-page">
			<div class="floating-pieces">
				<span class="float-piece" style="--x:8%;--y:25%;--delay:0s">♔</span>
				<span class="float-piece" style="--x:88%;--y:20%;--delay:1.2s">♛</span>
				<span class="float-piece" style="--x:12%;--y:75%;--delay:0.8s">♞</span>
				<span class="float-piece" style="--x:85%;--y:70%;--delay:2s">♜</span>
			</div>
			<div class="diff-page-content">
				<button class="back-btn" onclick={() => gameState = 'menu'}>← Back</button>
				<div class="diff-hero">
					<div class="diff-icon-big {selectedDifficulty?.id}">
						{#if selectedDifficulty?.id === 'beginner'}♙{:else if selectedDifficulty?.id === 'easy'}♘{:else if selectedDifficulty?.id === 'medium'}♗{:else}♛{/if}
					</div>
					<h1 class="diff-title">{selectedDifficulty?.name}</h1>
					<p class="diff-tagline">
						{#if selectedDifficulty?.id === 'beginner'}Just vibing & learning the basics 🌱{:else if selectedDifficulty?.id === 'easy'}Chill mode activated 😎{:else if selectedDifficulty?.id === 'medium'}Time to get serious ⚡{:else}No cap, this is intense 🔥{/if}
					</p>
				</div>
				<div class="diff-details">
					<div class="detail-card">
						<span class="detail-icon">🧠</span>
						<span class="detail-label">AI Behavior</span>
						<span class="detail-value">{selectedDifficulty?.desc}</span>
					</div>
					<div class="detail-card">
						<span class="detail-icon">⏱️</span>
						<span class="detail-label">Think Time</span>
						<span class="detail-value">{selectedDifficulty?.id === 'beginner' ? 'Instant moves' : selectedDifficulty?.id === 'easy' ? 'Quick thinking' : selectedDifficulty?.id === 'medium' ? 'Calculated' : 'Deep analysis'}</span>
					</div>
				</div>
				<button class="continue-btn" onclick={() => gameState = 'customize'}>
					<span>Let's Customize</span>
					<span class="btn-arrow">→</span>
				</button>
			</div>
		</div>
	{:else if gameState === 'customize'}
		<div class="customize-page">
			<div class="floating-pieces">
				<span class="float-piece" style="--x:5%;--y:15%;--delay:0.3s">♖</span>
				<span class="float-piece" style="--x:92%;--y:25%;--delay:1.5s">♝</span>
				<span class="float-piece" style="--x:8%;--y:80%;--delay:0.9s">♚</span>
				<span class="float-piece" style="--x:90%;--y:75%;--delay:2.2s">♟</span>
			</div>
			<div class="customize-content">
				<button class="back-btn" onclick={() => gameState = 'difficulty'}>← Back</button>
				<div class="customize-header">
					<h1 class="customize-title">Make it <span class="gradient-text">Yours</span></h1>
					<p class="customize-sub">Customize your chess experience ✨</p>
				</div>
				<div class="customize-grid">
					<div class="custom-section">
						<div class="section-head"><span class="section-num">01</span><h3>Pick Your Side</h3></div>
						<p class="section-desc">White moves first, black plays reactive</p>
						<div class="color-opts">
							<button class="color-btn" class:selected={playerColor === 'w'} onclick={() => playerColor = 'w'}>
								<span class="color-piece white">♔</span>
								<span class="color-label">White</span>
							</button>
							<button class="color-btn" class:selected={playerColor === 'b'} onclick={() => playerColor = 'b'}>
								<span class="color-piece black">♚</span>
								<span class="color-label">Black</span>
							</button>
						</div>
					</div>
					<div class="custom-section">
						<div class="section-head"><span class="section-num">02</span><h3>Piece Style</h3></div>
						<p class="section-desc">Choose your aesthetic</p>
						<div class="style-opts">
							{#each pieceStyles as s, i}
								<button class="style-btn" class:selected={pieceStyle === i} onclick={() => pieceStyle = i}>
									<span class="style-preview">{s.pieces.wK}{s.pieces.bQ}</span>
									<span class="style-name">{s.name}</span>
								</button>
							{/each}
						</div>
					</div>
					<div class="custom-section">
						<div class="section-head"><span class="section-num">03</span><h3>Board Theme</h3></div>
						<p class="section-desc">Set the vibe</p>
						<div class="board-opts">
							{#each boardStyles as s, i}
								<button class="board-btn" class:selected={boardStyle === i} onclick={() => boardStyle = i}>
									<div class="board-preview">
										<div style="background:{s.light}"></div>
										<div style="background:{s.dark}"></div>
										<div style="background:{s.dark}"></div>
										<div style="background:{s.light}"></div>
									</div>
									<span class="board-name">{s.name}</span>
								</button>
							{/each}
						</div>
					</div>
					<div class="custom-section">
						<div class="section-head"><span class="section-num">04</span><h3>Time Control</h3></div>
						<p class="section-desc">How long you got?</p>
						<div class="time-opts">
							{#each timeOptions as t}
								<button class="time-btn" class:selected={timeControl === t.value} onclick={() => timeControl = t.value}>
									{t.label}
								</button>
							{/each}
						</div>
					</div>
				</div>
				<button class="start-game-btn" onclick={startGame}>
					<span class="btn-icon-left">♟</span>
					<span>Start Playing</span>
					<span class="btn-icon-right">→</span>
				</button>
			</div>
		</div>
	{:else if gameState === 'playing' || gameState === 'gameover'}
		<div class="game-layout">
			<div class="game-left">
				<div class="player-bar"><div class="player-info"><div class="avatar ai">🤖</div><div class="pdet"><span class="pname">Prasidh's AI</span><span class="plvl">{selectedDifficulty?.name}</span></div></div>{#if timeControl}<div class="ptime" class:active={!isPlayerTurn && gameState === 'playing'}>{formatTimer(aiTime)}</div>{/if}</div>
				<div class="board-area" style="--dark:{boardStyles[boardStyle].dark};--light:{boardStyles[boardStyle].light}">
					<div class="captured-area ai"><div class="captured-label">Prasidh</div><div class="captured-pieces">{#each capturedByAI as p}<span class="cap-piece white">{p}</span>{/each}</div></div>
					<div class="board-wrapper">
						<div class="board" style="--light:{boardStyles[boardStyle].light};--dark:{boardStyles[boardStyle].dark}">{#each boardSquares as {square, piece}}<button class="sq {getSquareClass(square, piece)}" onclick={() => handleSquareClick(square)} disabled={gameState === 'gameover'}>{#if piece}<span class="piece {piece.color === 'w' ? 'white' : 'black'}">{getPiece(piece.color, piece.type)}</span>{#if legalMoves.includes(square)}<span class="capture-ring"></span>{/if}{/if}{#if legalMoves.includes(square) && !piece}<span class="dot"></span>{/if}</button>{/each}</div>
					</div>
					<div class="captured-area player"><div class="captured-label">You</div><div class="captured-pieces">{#each capturedByPlayer as p}<span class="cap-piece black">{p}</span>{/each}</div></div>
				</div>
				<div class="player-bar"><div class="player-info"><div class="avatar you">👤</div><div class="pdet"><span class="pname">Player</span><span class="plvl">You</span></div></div>{#if timeControl}<div class="ptime" class:active={isPlayerTurn && gameState === 'playing'}>{formatTimer(playerTime)}</div>{/if}</div>
			</div>
			<div class="game-right">
				{#if gameState === 'gameover'}
					<div class="gameover-banner {gameStatus.includes('win') ? 'win' : gameStatus.includes('lose') ? 'lose' : 'draw'}">
						<div class="go-emoji">{gameStatus.includes('win') ? '🎉' : gameStatus.includes('lose') ? '😔' : '🤝'}</div>
						<div class="go-text">
							<span class="go-title">{gameStatus.includes('win') ? 'You Won!' : gameStatus.includes('lose') ? 'You Lost' : 'Draw!'}</span>
							<span class="go-sub">{gameStatus.includes('win') ? 'GG! You crushed it! 🔥' : gameStatus.includes('lose') ? 'Keep grinding, you got this! 💪' : 'Well played by both sides!'}</span>
						</div>
						{#if gameStatus.includes('win')}
							<div class="confetti">
								<span style="--i:0">🎊</span><span style="--i:1">✨</span><span style="--i:2">🎉</span><span style="--i:3">⭐</span><span style="--i:4">🏆</span>
							</div>
						{/if}
					</div>
					<div class="game-btns go-btns">
						<button class="ctrl-btn quit" onclick={newGame}>🚪 Quit</button>
						<button class="ctrl-btn restart" onclick={startGame}>🔄 Retry</button>
					</div>
				{/if}
				<div class="moves-panel"><div class="moves-header"><h3>Moves</h3><span class="mc">{rawMoves.length}</span></div><div class="moves-cols"><span class="col-num">#</span><span class="col-player">Player</span><span class="col-ai">Prasidh's AI</span></div><div class="moves-list">{#each moveHistory as m, i}<div class="move-row"><span class="mn">{i+1}.</span><span class="mv w">{m.white}</span><span class="mv b">{m.black}</span></div>{/each}</div></div>
				{#if gameState === 'playing'}
					<div class="game-btns">
						<button class="ctrl-btn quit" onclick={newGame}>🚪 Quit Game</button>
						<button class="ctrl-btn restart" onclick={startGame}>🔄 Restart</button>
					</div>
				{/if}
			</div>
		</div>
		{#if showPromotion}<div class="promo-overlay"><div class="promo-modal"><p>Promote to:</p><div class="promo-pieces">{#each ['q','r','b','n'] as p}<button onclick={() => handlePromotion(p)}>{getPiece(playerColor, p)}</button>{/each}</div></div></div>{/if}
	{/if}
</section>


<style>
.chess-app{display:flex;flex-direction:column;height:100%;background:#161512;border-radius:inherit;overflow:hidden;font-family:-apple-system,sans-serif;color:#fff;position:relative}
.chess-app.light{background:#f5f5f5;color:#1a1a1a}
.chess-header{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;padding-top:40px;background:#1a1816;border-bottom:1px solid #2a2826}
.chess-app.light .chess-header{background:#fff;border-color:#e0e0e0}
.chess-title{font-size:16px;font-weight:600}
.status{font-size:13px;color:#888;padding:6px 16px;border-radius:20px;position:relative;overflow:hidden}
.status.active{background:rgba(255,255,255,0.1)}
.status.active::before{content:'';position:absolute;inset:-2px;background:conic-gradient(from 0deg,transparent,var(--light,#f0d9b5),transparent 30%);animation:spin-border 1.5s linear infinite;border-radius:inherit}
.status.active::after{content:attr(data-text);position:absolute;inset:2px;background:#1a1816;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff}
.chess-app.light .status.active::after{background:#f5f5f5;color:#1a1a1a}
.status.check{color:#e74c3c;font-weight:600}
@keyframes spin-border{to{transform:rotate(360deg)}}
.header-actions{display:flex;gap:8px}
.icon-btn{background:rgba(255,255,255,0.1);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}
.icon-btn:hover{background:rgba(255,255,255,0.2)}
.chess-app.light .icon-btn{background:rgba(0,0,0,0.05)}
.btn-icon{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-family:Georgia,serif}
.btn-icon.rules-icon{font-size:16px;font-weight:700;font-style:italic;color:#629924}
.btn-icon.theme-icon{font-size:18px;color:#fbbf24}
.rules-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.8);z-index:200;display:flex;justify-content:flex-end}
.rules-panel{width:280px;height:100%;background:#1a1816;overflow-y:auto}
.chess-app.light .rules-panel{background:#fff}
.rules-header{display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid #333;position:sticky;top:0;background:inherit}
.rules-header h2{font-size:15px;margin:0}
.close-btn{background:none;border:none;color:#888;font-size:16px;cursor:pointer}
.rules-content{padding:14px}
.rule-section{margin-bottom:14px}
.rule-section h3{font-size:12px;margin-bottom:4px;color:#629924}
.rule-section p{font-size:11px;color:#aaa;line-height:1.3}
.chess-app.light .rule-section p{color:#666}
.pd{font-size:24px;margin:4px 0;letter-spacing:4px}
.loading{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#666}
.spinner{width:32px;height:32px;border:3px solid #333;border-top-color:#629924;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.menu{flex:1;display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden}
.floating-pieces{position:absolute;inset:0;pointer-events:none}
.float-piece{position:absolute;left:var(--x);top:var(--y);font-size:40px;opacity:0.12;animation:float 6s ease-in-out infinite;animation-delay:var(--delay)}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(10deg)}}
.menu-content{text-align:center;max-width:420px;width:100%;position:relative;z-index:1}
.logo-big{font-size:64px;margin-bottom:8px}
.title-big{font-size:32px;font-weight:700;margin-bottom:4px}
.subtitle-big{font-size:16px;color:#888;margin-bottom:16px}
.warning-box{display:flex;align-items:flex-start;gap:12px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:12px;padding:12px 16px;margin-bottom:20px;text-align:left}
.warn-icon{font-size:24px}
.warn-text{display:flex;flex-direction:column;gap:2px}
.warn-text strong{font-size:13px;color:#fbbf24}
.warn-text span{font-size:11px;color:#a0a0a0;line-height:1.4}
.diff-grid-2x2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.diff-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 12px;background:#262421;border:2px solid transparent;border-radius:12px;cursor:pointer;color:#fff;transition:all 0.2s}
.diff-card:hover{transform:translateY(-2px)}
.diff-card.beginner{border-color:#22c55e}.diff-card.beginner:hover{background:rgba(34,197,94,0.15)}
.diff-card.easy{border-color:#3b82f6}.diff-card.easy:hover{background:rgba(59,130,246,0.15)}
.diff-card.medium{border-color:#f59e0b}.diff-card.medium:hover{background:rgba(245,158,11,0.15)}
.diff-card.hard{border-color:#ef4444}.diff-card.hard:hover{background:rgba(239,68,68,0.15)}
.chess-app.light .diff-card{background:#fff;color:#1a1a1a}
.card-icon{font-size:28px}
.icon-circle{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;font-size:26px;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.3)}
.icon-circle.green{background:linear-gradient(135deg,#22c55e,#16a34a)}
.icon-circle.blue{background:linear-gradient(135deg,#3b82f6,#2563eb)}
.icon-circle.orange{background:linear-gradient(135deg,#f59e0b,#d97706)}
.icon-circle.red{background:linear-gradient(135deg,#ef4444,#dc2626)}
.card-name{font-size:15px;font-weight:700}
.card-desc{font-size:10px;color:#888}
.external-links{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.ext-link{display:flex;align-items:center;gap:5px;padding:8px 14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;color:#ccc;text-decoration:none;font-size:12px;transition:all 0.2s}
.ext-link:hover{background:rgba(255,255,255,0.15);color:#fff;transform:translateY(-1px)}
.chess-app.light .ext-link{background:rgba(0,0,0,0.05);border-color:rgba(0,0,0,0.1);color:#555}
.chess-app.light .ext-link:hover{color:#000}
.logo{font-size:44px;margin-bottom:6px}
h1{font-size:22px;font-weight:700;margin-bottom:2px}
.subtitle{font-size:12px;color:#888;margin-bottom:14px}
.warning{display:flex;align-items:center;gap:6px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:6px 10px;font-size:10px;color:#fbbf24;margin-bottom:14px;justify-content:center}
.section-label{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:8px}
.diff-grid{display:flex;flex-direction:column;gap:6px}
.diff-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#262421;border:1px solid #333;border-radius:8px;cursor:pointer;color:#fff;transition:all 0.2s}
.diff-btn:hover{background:#302e2b;border-color:#629924}
.chess-app.light .diff-btn{background:#fff;border-color:#e0e0e0;color:#1a1a1a}
.diff-icon{font-size:18px}
.diff-name{flex:1;font-size:13px;font-weight:600;text-align:left}
.diff-arrow{color:#444;font-size:12px}
.back-btn{background:none;border:none;color:#888;font-size:12px;cursor:pointer;margin-bottom:14px;padding:8px 0}
.back-btn:hover{color:#fff}
.chess-app.light .back-btn:hover{color:#333}
.selected-diff{margin-bottom:18px}
.big-icon{font-size:44px;display:block;margin-bottom:6px}
.selected-diff h2{font-size:18px;margin-bottom:4px}
.selected-diff p{font-size:11px;color:#888;line-height:1.4}
.start-btn{padding:10px 24px;background:#629924;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer}
.start-btn:hover{background:#7ab82d}

/* Difficulty Page */
.diff-page{flex:1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:20px}
.diff-page-content{text-align:center;max-width:400px;width:100%;position:relative;z-index:1}
.diff-hero{margin-bottom:24px}
.diff-icon-big{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:42px;margin:0 auto 16px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.3)}
.diff-icon-big.beginner{background:linear-gradient(135deg,#22c55e,#16a34a)}
.diff-icon-big.easy{background:linear-gradient(135deg,#3b82f6,#2563eb)}
.diff-icon-big.medium{background:linear-gradient(135deg,#f59e0b,#d97706)}
.diff-icon-big.hard{background:linear-gradient(135deg,#ef4444,#dc2626)}
.diff-title{font-size:36px;font-weight:800;margin-bottom:8px}
.diff-tagline{font-size:16px;color:#888}
.diff-details{display:flex;gap:12px;margin-bottom:24px}
.detail-card{flex:1;background:#262421;border-radius:12px;padding:16px;text-align:center;display:flex;flex-direction:column;gap:6px}
.chess-app.light .detail-card{background:#fff;border:1px solid #e0e0e0}
.detail-icon{font-size:24px}
.detail-label{font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px}
.detail-value{font-size:12px;color:#ccc}
.chess-app.light .detail-value{color:#555}
.continue-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px 24px;background:linear-gradient(135deg,#629924,#4a7a1a);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s}
.continue-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(98,153,36,0.3)}
.btn-arrow{font-size:20px}

/* Customize Page */
.customize-page{flex:1;display:flex;position:relative;overflow:hidden;padding:16px}
.customize-content{flex:1;display:flex;flex-direction:column;position:relative;z-index:1;overflow-y:auto}
.customize-header{text-align:center;margin-bottom:20px}
.customize-title{font-size:28px;font-weight:800;margin-bottom:4px}
.gradient-text{background:linear-gradient(135deg,#629924,#84cc16);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.customize-sub{font-size:14px;color:#888}
.customize-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.custom-section{background:#262421;border-radius:12px;padding:16px}
.chess-app.light .custom-section{background:#fff;border:1px solid #e0e0e0}
.section-head{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.section-num{font-size:11px;font-weight:700;color:#629924;background:rgba(98,153,36,0.15);padding:4px 8px;border-radius:6px}
.section-head h3{font-size:15px;font-weight:700;margin:0}
.section-desc{font-size:11px;color:#888;margin-bottom:12px}
.color-opts{display:flex;gap:10px}
.color-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px;background:#1a1816;border:2px solid transparent;border-radius:10px;cursor:pointer;transition:all 0.2s}
.color-btn.selected{border-color:#629924;background:rgba(98,153,36,0.1)}
.chess-app.light .color-btn{background:#f5f5f5}
.color-piece{font-size:32px}
.color-piece.white{color:#fff;text-shadow:0 0 3px #000}
.color-piece.black{color:#000}
.color-label{font-size:12px;font-weight:600;color:#fff}
.chess-app.light .color-label{color:#333}
.style-opts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.style-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px;background:#1a1816;border:2px solid transparent;border-radius:10px;cursor:pointer;color:#fff;transition:all 0.2s}
.style-btn:hover{transform:translateY(-2px);background:#262421}
.style-btn.selected{border-color:#629924;background:rgba(98,153,36,0.15)}
.chess-app.light .style-btn{background:#f5f5f5;color:#333}
.chess-app.light .style-btn:hover{background:#eee}
.style-preview{font-size:26px;letter-spacing:4px;text-shadow:0 2px 4px rgba(0,0,0,0.2)}
.style-name{font-size:10px;color:#888;font-weight:500}
.board-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.board-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;background:#1a1816;border:2px solid transparent;border-radius:8px;cursor:pointer;transition:all 0.2s}
.board-btn.selected{border-color:#629924}
.chess-app.light .board-btn{background:#f5f5f5}
.board-preview{display:grid;grid-template-columns:1fr 1fr;width:32px;height:32px;border-radius:4px;overflow:hidden}
.board-preview div{width:16px;height:16px}
.board-name{font-size:9px;color:#888}
.time-opts{display:flex;flex-wrap:wrap;gap:8px}
.time-btn{padding:8px 14px;background:#1a1816;border:2px solid transparent;border-radius:20px;cursor:pointer;color:#fff;font-size:12px;transition:all 0.2s}
.time-btn.selected{border-color:#629924;background:rgba(98,153,36,0.1)}
.chess-app.light .time-btn{background:#f5f5f5;color:#333}
.start-game-btn{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;padding:18px 24px;background:linear-gradient(135deg,#629924,#4a7a1a);color:#fff;border:none;border-radius:14px;font-size:18px;font-weight:700;cursor:pointer;transition:all 0.2s;margin-top:auto}
.start-game-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(98,153,36,0.4)}
.btn-icon-left{font-size:22px}
.btn-icon-right{font-size:20px}
.game-layout{flex:1;display:flex;gap:10px;padding:10px;overflow:hidden}
.game-left{display:flex;flex-direction:column;gap:6px;width:50%}
.game-right{flex:1;display:flex;flex-direction:column;gap:8px;min-width:160px;overflow:hidden}
.board-area{display:flex;gap:6px;flex:1;align-items:stretch;min-height:0}
.captured-area{flex:1;display:flex;flex-direction:column;padding:8px;border-radius:6px;flex-shrink:0;max-width:80px}
.captured-area.ai{background:var(--dark,#b58863)}
.captured-area.player{background:var(--light,#f0d9b5)}
.chess-app.light .captured-area.ai{background:var(--dark,#b58863)}
.chess-app.light .captured-area.player{background:var(--light,#f0d9b5)}
.captured-label{font-size:9px;text-transform:uppercase;margin-bottom:8px;text-align:center}
.captured-area.ai .captured-label{color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.3)}
.captured-area.player .captured-label{color:#333;text-shadow:0 1px 1px rgba(255,255,255,0.5)}
.captured-pieces{display:flex;flex-direction:row;flex-wrap:wrap;gap:0;align-items:flex-start;align-content:flex-start;justify-content:center;flex:1;overflow-y:auto}
.cap-piece{font-size:28px;line-height:1}
.cap-piece.white{color:#fff;text-shadow:0 0 2px #000,0 0 2px #000}
.cap-piece.black{color:#000;text-shadow:0 0 1px rgba(255,255,255,0.3)}
.player-bar{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#262421;border-radius:6px;flex-shrink:0}
.chess-app.light .player-bar{background:#fff;border:1px solid #e0e0e0}
.player-info{display:flex;align-items:center;gap:10px}
.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background:#333}
.avatar.ai{background:linear-gradient(135deg,#629924,#3d5c16)}
.avatar.you{background:linear-gradient(135deg,#3b82f6,#1d4ed8)}
.pdet{display:flex;flex-direction:column}
.pname{font-size:14px;font-weight:700}
.plvl{font-size:10px;color:#888}
.ptime{font-size:16px;font-weight:700;font-family:monospace;padding:4px 10px;background:#1a1816;border-radius:4px}
.ptime.active{background:#629924;color:#fff}
.chess-app.light .ptime{background:#f0f0f0}
.board-wrapper{flex:1;display:flex;align-items:stretch;justify-content:center}
.board{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);aspect-ratio:1;border:2px solid #302e2b;border-radius:4px;overflow:hidden}
.sq{display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;position:relative;padding:0;margin:0}
.sq.light{background:var(--light,#f0d9b5)}
.sq.dark{background:var(--dark,#b58863)}
.sq.selected{background:#829769!important}
.sq.capture{background:#aaa23a!important}
.sq.last-move{background:#cdd26a!important}
.sq.in-check{background:#e74c3c!important}
.dot{width:26%;height:26%;background:rgba(0,0,0,0.2);border-radius:50%}
.capture-ring{position:absolute;inset:3px;border:3px solid rgba(0,0,0,0.25);border-radius:50%;pointer-events:none}
.piece{font-size:clamp(40px,7vh,66px);line-height:1;user-select:none}
.piece.white{color:#fff;text-shadow:0 0 2px #000,0 0 2px #000}
.piece.black{color:#000;text-shadow:0 0 1px rgba(255,255,255,0.3)}
.moves-panel{flex:1;background:#262421;border-radius:6px;display:flex;flex-direction:column;overflow:hidden}
.chess-app.light .moves-panel{background:#fff;border:1px solid #e0e0e0}
.moves-header{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #333}
.moves-header h3{font-size:14px;margin:0;font-weight:600}
.mc{font-size:10px;color:#888;background:#333;padding:2px 6px;border-radius:8px}
.moves-cols{display:grid;grid-template-columns:30px 1fr 1fr;gap:8px;padding:8px 12px;border-bottom:1px solid #333;font-size:11px;color:#888;font-weight:600}
.col-num{text-align:center}
.col-player{text-align:center;color:#3b82f6}
.col-ai{text-align:center;color:#629924}
.moves-list{flex:1;overflow-y:auto;padding:6px}
.move-row{display:grid;grid-template-columns:30px 1fr 1fr;gap:8px;padding:10px 12px;border-radius:4px;font-size:14px;font-family:monospace;font-weight:500;min-height:40px;align-items:center}
.move-row:nth-child(odd){background:rgba(255,255,255,0.03)}
.mn{color:#666;font-size:12px;text-align:center}
.mv{padding:4px 8px;border-radius:4px;text-align:center;font-size:14px}
.mv.w{background:rgba(59,130,246,0.15);color:#60a5fa}
.mv.b{background:rgba(98,153,36,0.15);color:#84cc16}
.ctrl-btn{padding:10px;background:#333;color:#fff;border:none;border-radius:6px;font-size:12px;cursor:pointer}
.ctrl-btn:hover{background:#444}
.game-btns{display:flex;gap:8px}
.game-btns .ctrl-btn{flex:1;border-radius:20px;padding:10px 16px;font-weight:500}
.game-btns .ctrl-btn.quit{background:#dc3545}
.game-btns .ctrl-btn.quit:hover{background:#c82333}
.game-btns .ctrl-btn.restart{background:#629924}
.game-btns .ctrl-btn.restart:hover{background:#7ab82d}
.go-btns{margin-bottom:10px}

/* Game Over Banner */
.gameover-banner{display:flex;align-items:center;gap:12px;padding:16px;border-radius:12px;margin-bottom:10px;position:relative;overflow:hidden}
.gameover-banner.win{background:linear-gradient(135deg,rgba(34,197,94,0.2),rgba(16,185,129,0.1));border:1px solid rgba(34,197,94,0.3)}
.gameover-banner.lose{background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.1));border:1px solid rgba(239,68,68,0.3)}
.gameover-banner.draw{background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(37,99,235,0.1));border:1px solid rgba(59,130,246,0.3)}
.go-emoji{font-size:36px;animation:bounce 0.6s ease infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.go-text{display:flex;flex-direction:column;gap:2px}
.go-title{font-size:18px;font-weight:700}
.gameover-banner.win .go-title{color:#22c55e}
.gameover-banner.lose .go-title{color:#ef4444}
.gameover-banner.draw .go-title{color:#3b82f6}
.go-sub{font-size:12px;color:#888}
.confetti{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;gap:4px}
.confetti span{font-size:18px;animation:confetti-fall 1.5s ease-in-out infinite;animation-delay:calc(var(--i) * 0.2s)}
@keyframes confetti-fall{0%,100%{transform:translateY(0) rotate(0deg);opacity:1}50%{transform:translateY(-10px) rotate(20deg);opacity:0.7}}
.promo-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:100}
.promo-modal{background:#262421;padding:14px;border-radius:8px;text-align:center}
.promo-modal p{margin-bottom:10px;color:#888;font-size:12px}
.promo-pieces{display:flex;gap:5px}
.promo-pieces button{width:40px;height:40px;font-size:24px;background:#333;border:none;border-radius:5px;cursor:pointer;color:#fff}
.promo-pieces button:hover{background:#444}
.play-btn{padding:10px 24px;background:#629924;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer}
.play-btn:hover{background:#7ab82d}
</style>
