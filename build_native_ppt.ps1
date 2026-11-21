try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pres = $ppt.Presentations.Add()
    $slide = $pres.Slides.Add(1, 1) # ppLayoutTitle
    $slide.Shapes.Item(1).TextFrame.TextRange.Text = "FloodRadarX — Know Risk. Plan Better."
    $slide.Shapes.Item(2).TextFrame.TextRange.Text = "Next-Gen Hydro-Meteorological Disaster Intelligence"
    
    $outputPath = "C:\Users\paavani jindal\OneDrive\Desktop\FloodRadarX\FloodRadarX_Presentation.pptx"
    if (Test-Path $outputPath) {
        Remove-Item $outputPath -Force
    }
    
    $pres.SaveAs($outputPath)
    $pres.Close()
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Host "COM_PPTX_SUCCESS: Saved to $outputPath"
} catch {
    Write-Host "COM_PPTX_ERROR: $($_.Exception.Message)"
}
