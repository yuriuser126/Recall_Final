package com.boot.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PdfGenerationService {
	@Value("${wkhtmltopdf.executable}")
    private String wkhtmltopdfPath;

	// 사용할 한글 폰트 (시스템에 설치된 폰트 이름)
    private final String hangulFont = "NanumGothic"; 
    
    public File generatePdfFromHtml(String htmlContent, String outputFileName) throws IOException, InterruptedException {
    	String styledHtmlContent = "<style>body { font-family: 'Malgun Gothic', 'sans-serif'; }</style>" + htmlContent;

        File outputFile = new File(outputFileName);
        List<String> command = new ArrayList<>();
        command.add(wkhtmltopdfPath);
        command.add("-"); // 입력으로 stdin 사용
        command.add(outputFile.getAbsolutePath());
        

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectInput(ProcessBuilder.Redirect.PIPE);
        processBuilder.redirectError(ProcessBuilder.Redirect.INHERIT); // 에러 스트림을 콘솔에 출력
        Process process = processBuilder.start();

        // HTML 내용을 wkhtmltopdf 프로세스의 stdin으로 전달
        try (java.io.OutputStream os = process.getOutputStream()) {
            byte[] htmlBytes = styledHtmlContent.getBytes("UTF-8");
            os.write(htmlBytes);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("wkhtmltopdf exited with error code: " + exitCode);
        }

        return outputFile;
    }
    public File generatePdfFromUrl(String url, String outputFileName) throws IOException, InterruptedException {
        File outputFile = new File(outputFileName);
        List<String> command = new ArrayList<>();
        command.add(wkhtmltopdfPath);
        command.add(url);
        command.add(outputFile.getAbsolutePath());

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException("wkhtmltopdf exited with error code: " + exitCode);
        }

        return outputFile;
    }
}
