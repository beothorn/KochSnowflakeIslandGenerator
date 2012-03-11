package Main;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.JFrame;

import koch.Island;

public class Main extends JFrame {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private final int width = 800;

	private final int height = 600;

	private Island island;
	
	public static void main(String[] args) {
		new Main();
	}
	
	public Main() {
		this.addKeyListener(new KeyListener(){
			@Override
			public void keyPressed(KeyEvent e) {
				createIsland();
			}
			@Override
			public void keyReleased(KeyEvent e) {
			}
			@Override
			public void keyTyped(KeyEvent e) {
			}
		});
		
		startGui();
		createIsland();
	}

	private void createIsland() {
		int islandComplexity = 3;
		island = new Island(islandComplexity,width,height);
		invalidate();
		repaint();
	}

	private void startGui() {
		this.pack();
		this.setSize(width, height);
		this.setDefaultCloseOperation(EXIT_ON_CLOSE);
		this.setVisible(true);
	}
	
	/**
     * This is the method where the line is drawn.
     *
     * @param g The graphics object
     */
    public void paint(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;
        g.setColor(Color.BLUE);
        g.fillRect(0, 0, this.getWidth(), this.getHeight());
        if(island!=null)
        	island.paint(g2);
    }
    
}
